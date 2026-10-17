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

test('checkExitGapCleared only triggers when flag body has fully cleared the ring perimeter', () => {
  const ringRadius = 150;
  const entityRadius = 11;
  const outerMargin = 6;

  // When flag center is still on or barely past ring (e.g. dist = 155),
  // inner edge is 155 - 11 = 144 < 156 (still passing through) -> must NOT trigger elimination
  assert.equal(checkExitGapCleared(155, entityRadius, ringRadius, outerMargin), false);

  // When flag center is at 166, inner edge is 166 - 11 = 155 < 156 -> still touching ring!
  assert.equal(checkExitGapCleared(166, entityRadius, ringRadius, outerMargin), false);

  // When flag center reaches 168 (inner edge 157 > 156), body has completely cleared the outer ring!
  assert.equal(checkExitGapCleared(168, entityRadius, ringRadius, outerMargin), true);
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
