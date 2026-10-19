import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterCountriesByContinents,
  formatSessionTime,
  computeLeaderboard,
  isAngleInGap,
  normalizeAngle,
  resolveElasticCollision,
  getNextSpeed,
  getContinentCountryCounts,
  checkExitGapCleared,
  resolveShieldAbsorption,
  computeTargetAngle,
  findNearestOpponent,
  CANNON_MAX_SHOTS,
  CANNON_SHOT_INTERVAL,
  GUN_SHOT_MAX_SHOTS,
  GUN_SHOT_INTERVAL,
  FLAG_BASE_WIDTH,
  FLAG_BASE_HEIGHT,
  FLAG_BASE_RADIUS,
  SpeechQueueManager,
  computeResponsiveScale,
  CELEBRATION_PAUSE_MS,
  determineRoundWinner,
  EXIT_CROSSING_THRESHOLD,
  computeExitCrossingFraction,
  computeDescendingEliminationRank,
  SPEECH_RATE_FASTER,
  SPEECH_RATE_MEASURED,
  formatBackingFlagEliminationSpeech,
  formatBackingFlagEliminationBanner,
  COUNTRIES,
  ALL_CONTINENTS,
  type WinRecord
} from './battle-rules.ts';

test('continents and country datasets have exact specified counts across all 7 continents', () => {
  assert.equal(ALL_CONTINENTS.length, 7);
  assert.equal(COUNTRIES.length, 196, 'Total roster should be exactly 196 countries');

  const counts = getContinentCountryCounts();
  assert.equal(counts['Africa'], 54, 'Africa must have exactly 54 flags');
  assert.equal(counts['Europe'], 44, 'Europe must have exactly 44 flags');
  assert.equal(counts['Asia'], 48, 'Asia must have exactly 48 flags');
  assert.equal(counts['North America'], 23, 'North America must have exactly 23 flags');
  assert.equal(counts['Oceania'], 14, 'Oceania must have exactly 14 flags');
  assert.equal(counts['South America'], 12, 'South America must have exactly 12 flags');
  assert.equal(counts['Antarctica'], 1, 'Antarctica must have exactly 1 flag');

  // Verify Palestine is in Asia
  const palestine = COUNTRIES.find(c => c.name === 'Palestine');
  assert.ok(palestine, 'Palestine must exist in country list');
  assert.equal(palestine.continent, 'Asia');
  assert.equal(palestine.id, 'ps');

  // Verify Antarctica is solid white flag
  const antarctica = COUNTRIES.find(c => c.continent === 'Antarctica');
  assert.ok(antarctica, 'Antarctica must exist');
  assert.equal(antarctica.name, 'Antarctica');
  assert.deepEqual(antarctica.colors, ['#ffffff', '#ffffff']);
});

test('checkExitGapCleared triggers when 60% of flag body has crossed through exit opening', () => {
  const ringRadius = 475;
  const entityRadius = 23; // 200% scale radius

  assert.equal(EXIT_CROSSING_THRESHOLD, 0.60);

  // 0% crossed (outer edge barely touching ring): dist = ringRadius - entityRadius = 452
  assert.equal(computeExitCrossingFraction(452, entityRadius, ringRadius), 0.0);
  assert.equal(checkExitGapCleared(452, entityRadius, ringRadius), false);

  // 50% crossed (flag center right on the ring): dist = 475
  assert.equal(computeExitCrossingFraction(475, entityRadius, ringRadius), 0.5);
  assert.equal(checkExitGapCleared(475, entityRadius, ringRadius), false);

  // 59% crossed: dist = 475 + (0.59 * 46 - 23) = 479.14 -> not yet 60%
  assert.equal(checkExitGapCleared(479, entityRadius, ringRadius), false);

  // Exactly 60% crossed: dist = 475 + 0.2 * 23 = 479.6
  assert.ok(Math.abs(computeExitCrossingFraction(479.6, entityRadius, ringRadius) - 0.60) < 1e-6);
  assert.equal(checkExitGapCleared(479.6, entityRadius, ringRadius), true);

  // >60% crossed (e.g. dist = 485): triggers elimination immediately without waiting for 100%
  assert.equal(checkExitGapCleared(485, entityRadius, ringRadius), true);
});

test('resolveShieldAbsorption grants one-time immunity and shatters shield', () => {
  const flagWithShield = { hasShield: true };
  const flagWithoutShield = { hasShield: false };

  // Hit 1: absorbed!
  const hit1 = resolveShieldAbsorption(flagWithShield);
  assert.equal(hit1, true);
  assert.equal(flagWithShield.hasShield, false, 'Shield breaks after absorbing hit');

  // Hit 2: no shield left, takes hit!
  const hit2 = resolveShieldAbsorption(flagWithShield);
  assert.equal(hit2, false);

  // Flag without shield takes hit immediately
  assert.equal(resolveShieldAbsorption(flagWithoutShield), false);
});

test('cannon targeting finds nearest living opponent and computes aim angle', () => {
  const shooter = { x: 100, y: 100, id: 'jp' };
  const opponents = [
    { x: 200, y: 100, isEliminated: false, id: 'kr' }, // dist 100
    { x: 100, y: 300, isEliminated: false, id: 'us' }, // dist 200
    { x: 110, y: 100, isEliminated: true, id: 'fr' },  // dist 10, but ELIMINATED!
    { x: 100, y: 100, isEliminated: false, id: 'jp' }, // self
  ];

  const target = findNearestOpponent(shooter, opponents);
  assert.ok(target);
  assert.equal(target.id, 'kr', 'Should target nearest living opponent KR');

  const angle = computeTargetAngle(shooter.x, shooter.y, target.x, target.y);
  assert.equal(angle, 0); // Pointing directly to the right
});

test('filterCountriesByContinents returns all countries when all or none selected', () => {
  const allResult = filterCountriesByContinents(ALL_CONTINENTS);
  assert.equal(allResult.length, 196);

  const emptyResult = filterCountriesByContinents([]);
  assert.equal(emptyResult.length, 196);
});

test('filterCountriesByContinents filters accurately for single or subset continents', () => {
  const asiaOnly = filterCountriesByContinents(['Asia']);
  assert.equal(asiaOnly.length, 48);
  assert.ok(asiaOnly.every((c) => c.continent === 'Asia'));

  const antarcticaOnly = filterCountriesByContinents(['Antarctica']);
  assert.equal(antarcticaOnly.length, 1);
  assert.equal(antarcticaOnly[0].name, 'Antarctica');
});

test('formatSessionTime formats seconds into MM:SS correctly', () => {
  assert.equal(formatSessionTime(0), '00:00');
  assert.equal(formatSessionTime(5), '00:05');
  assert.equal(formatSessionTime(65), '01:05');
  assert.equal(formatSessionTime(600), '10:00');
  assert.equal(formatSessionTime(3599), '59:59');
  assert.equal(formatSessionTime(-10), '00:00');
});

test('computeLeaderboard sorts by highest wins and uses chronological first win as tie breaker', () => {
  const records: Record<string, WinRecord> = {
    us: { countryId: 'us', countryName: 'United States', emoji: '🇺🇸', wins: 2, firstWinRound: 2 },
    jp: { countryId: 'jp', countryName: 'Japan', emoji: '🇯🇵', wins: 3, firstWinRound: 1 },
    br: { countryId: 'br', countryName: 'Brazil', emoji: '🇧🇷', wins: 2, firstWinRound: 1 },
    de: { countryId: 'de', countryName: 'Germany', emoji: '🇩🇪', wins: 0, firstWinRound: 99 },
    fr: { countryId: 'fr', countryName: 'France', emoji: '🇫🇷', wins: 1, firstWinRound: 3 },
  };

  const top = computeLeaderboard(records);
  assert.equal(top.length, 4);
  assert.equal(top[0].countryId, 'jp');
  assert.equal(top[1].countryId, 'br');
  assert.equal(top[2].countryId, 'us');
  assert.equal(top[3].countryId, 'fr');
});

test('normalizeAngle maps any angle to [0, 2*PI)', () => {
  const twoPi = Math.PI * 2;
  assert.equal(normalizeAngle(0), 0);
  assert.ok(Math.abs(normalizeAngle(twoPi) - 0) < 1e-6);
  assert.ok(Math.abs(normalizeAngle(-Math.PI / 2) - 1.5 * Math.PI) < 1e-6);
  assert.ok(Math.abs(normalizeAngle(3 * Math.PI) - Math.PI) < 1e-6);
});

test('isAngleInGap accurately detects escape gap aperture', () => {
  const ringAngle = 0;
  const gapAngle = 0;
  const gapWidth = Math.PI / 4;

  assert.equal(isAngleInGap(0, ringAngle, gapAngle, gapWidth), true);
  assert.equal(isAngleInGap(Math.PI / 10, ringAngle, gapAngle, gapWidth), true);
  assert.equal(isAngleInGap(Math.PI / 2, ringAngle, gapAngle, gapWidth), false);
  assert.equal(isAngleInGap(Math.PI, ringAngle, gapAngle, gapWidth), false);
});

test('resolveElasticCollision updates velocity and pushes overlapping bodies apart', () => {
  const b1 = { x: 10, y: 10, vx: 2, vy: 0, mass: 1, radius: 10 };
  const b2 = { x: 20, y: 10, vx: -2, vy: 0, mass: 1, radius: 10 };

  const collided = resolveElasticCollision(b1, b2, 1.0);
  assert.equal(collided, true);
  assert.ok(b1.vx < 0);
  assert.ok(b2.vx > 0);
  assert.ok(b2.x > b1.x + 19.9);
});

test('getNextSpeed cycles through 0.5x, 1x, 1.5x, 2x accurately', () => {
  assert.equal(getNextSpeed(0.5), 1);
  assert.equal(getNextSpeed(1), 1.5);
  assert.equal(getNextSpeed(1.5), 2);
  assert.equal(getNextSpeed(2), 0.5);
});

test('cannon ammo is set to strictly 2 shots with 0.5s interval', () => {
  assert.equal(CANNON_MAX_SHOTS, 2, 'Cannon must have exactly 2 shots');
  assert.equal(CANNON_SHOT_INTERVAL, 0.5, 'Cannon shot interval must be 0.5 seconds');
});

test('computeResponsiveScale uniformly scales 1080x1920 layout to any screen aspect ratio', () => {
  // Exact 1080x1920 viewport
  assert.equal(computeResponsiveScale(1080, 1920), 1.0);
  // Half scale 540x960
  assert.equal(computeResponsiveScale(540, 960), 0.5);
  // Desktop wide screen 1920x1080 (constrained by height)
  assert.equal(computeResponsiveScale(1920, 1080), 1080 / 1920);
  // Narrow phone 360x800 (constrained by width)
  assert.equal(computeResponsiveScale(360, 800), 360 / 1080);
  // Zero / negative safeguard
  assert.equal(computeResponsiveScale(500, 500, 0, 0), 1);
});

test('continuous multi-round loop auto-progression and winner resolution', () => {
  assert.equal(CELEBRATION_PAUSE_MS, 2500, 'Celebration pause should be exactly 2.5 seconds');

  const flags = [
    { id: 'ca', isEliminated: false },
    { id: 'mx', isEliminated: true },
    { id: 'us', isEliminated: true },
  ];
  const dock = [
    { id: 'us', isEliminated: true },
    { id: 'mx', isEliminated: true },
  ];

  // 1 remaining flag -> clear winner
  const outcome1 = determineRoundWinner(flags, dock);
  assert.equal(outcome1.hasWinner, true);
  assert.equal(outcome1.winner?.id, 'ca');

  // >1 remaining flags -> round in progress
  flags[1].isEliminated = false;
  const outcome2 = determineRoundWinner(flags, dock);
  assert.equal(outcome2.hasWinner, false);
  assert.equal(outcome2.winner, null);

  // 0 remaining flags (simultaneous elimination) -> last eliminated flag in dock wins
  flags[0].isEliminated = true;
  flags[1].isEliminated = true;
  const outcome3 = determineRoundWinner(flags, dock);
  assert.equal(outcome3.hasWinner, true);
  assert.equal(outcome3.winner?.id, 'mx');
});

test('double flag sizing (200% scale) doubles dimensions and collision radius proportionally', () => {
  // Original dimensions were: width=30, height=19, radius=11.5
  assert.equal(FLAG_BASE_WIDTH, 60, 'Flag width scaled 200% should be 60');
  assert.equal(FLAG_BASE_HEIGHT, 38, 'Flag height scaled 200% should be 38');
  assert.equal(FLAG_BASE_RADIUS, 23, 'Flag collision radius scaled 200% should be 23');
  assert.equal(FLAG_BASE_WIDTH, 30 * 2);
  assert.equal(FLAG_BASE_HEIGHT, 19 * 2);
  assert.equal(FLAG_BASE_RADIUS, 11.5 * 2);
});

test('gun shot power-up parameters and naming', () => {
  assert.equal(GUN_SHOT_MAX_SHOTS, 2);
  assert.equal(GUN_SHOT_INTERVAL, 0.5);
  assert.equal(CANNON_MAX_SHOTS, 2);
});

test('SpeechQueueManager processes announcements sequentially without skipping or dropping messages', () => {
  const manager = new SpeechQueueManager();
  assert.equal(manager.length, 0);
  assert.equal(manager.busy, false);

  // 3 events triggering simultaneously (e.g., power-up activations and winner call)
  manager.enqueue('Gun Shot activated for France!');
  manager.enqueue('Magic Shield activated for Japan!');
  manager.enqueue('Canada is the winner!');

  assert.equal(manager.length, 3);
  assert.equal(manager.dequeue(), 'Gun Shot activated for France!');
  assert.equal(manager.length, 2);

  manager.setBusy(true);
  assert.equal(manager.busy, true);

  assert.equal(manager.dequeue(), 'Magic Shield activated for Japan!');
  assert.equal(manager.dequeue(), 'Canada is the winner!');
  assert.equal(manager.dequeue(), null);
  assert.equal(manager.length, 0);

  // Clear resets state
  manager.enqueue('Test voice');
  manager.clear();
  assert.equal(manager.length, 0);
  assert.equal(manager.busy, false);
});

test('computeDescendingEliminationRank tracks elimination positions in countdown order (e.g. 9, 8, 7, 6, 5, 4, 3, 2, 1 / Winner)', () => {
  const totalFlags = 9;

  // 1st elimination (0 eliminated before it): rank 9
  assert.equal(computeDescendingEliminationRank(totalFlags, 0), 9);

  // 2nd elimination (1 eliminated before it): rank 8
  assert.equal(computeDescendingEliminationRank(totalFlags, 1), 8);

  // 3rd elimination: rank 7
  assert.equal(computeDescendingEliminationRank(totalFlags, 2), 7);

  // 4th elimination: rank 6
  assert.equal(computeDescendingEliminationRank(totalFlags, 3), 6);

  // 5th elimination: rank 5
  assert.equal(computeDescendingEliminationRank(totalFlags, 4), 5);

  // 6th elimination: rank 4
  assert.equal(computeDescendingEliminationRank(totalFlags, 5), 4);

  // 7th elimination: rank 3
  assert.equal(computeDescendingEliminationRank(totalFlags, 6), 3);

  // 8th elimination (2 flags left, 1 dies): rank 2
  assert.equal(computeDescendingEliminationRank(totalFlags, 7), 2);

  // Surviving 1 flag is position 1 (Winner)
  assert.equal(computeDescendingEliminationRank(totalFlags, 8), 1);
});

test('measured speech queue rate and priority preemption with immediate flush on winner', () => {
  assert.equal(SPEECH_RATE_MEASURED, 0.92);
  assert.ok(SPEECH_RATE_MEASURED >= 0.85 && SPEECH_RATE_MEASURED <= 0.95);
  assert.equal(SPEECH_RATE_FASTER, 0.92);

  const manager = new SpeechQueueManager();
  manager.enqueue('Shield activated for Brazil');
  manager.enqueue('Speed boost for Norway');

  // Backed flag gets eliminated -> immediate urgent priority
  const speechText = formatBackingFlagEliminationSpeech('Japan', 4);
  assert.equal(speechText, 'Oh no! Backing flag Japan got eliminated at 4!');
  assert.equal(formatBackingFlagEliminationBanner('Japan', 4), 'Oh no! Backing flag Japan got eliminated at #4!');

  manager.enqueuePriority(speechText);
  assert.equal(manager.length, 3);
  assert.equal(manager.dequeue(), 'Oh no! Backing flag Japan got eliminated at 4!');

  // When round winner is decided -> immediately flush/clear all pending queued messages
  manager.clear();
  assert.equal(manager.length, 0);

  // And announce winner right away
  manager.enqueue('Japan is the winner!');
  assert.equal(manager.length, 1);
  assert.equal(manager.dequeue(), 'Japan is the winner!');
});



