/**
 * Pure domain logic and calculations for Country Flag Elimination Battle Arena.
 * Fully decoupled for deterministic unit testing.
 */

export interface CountryData {
  id: string; // ISO 3166-1 alpha-2 lowercase code for flagcdn.com (e.g. 'jp', 'us', 'aq')
  name: string;
  continent: 'Asia' | 'Europe' | 'Africa' | 'North America' | 'South America' | 'Oceania' | 'Antarctica';
  code: string; // 3-letter abbreviation for display badge
  emoji: string;
  colors: string[]; // Primary color stripes/palette for crisp vector canvas fallback
  flagType: 'horizontal' | 'vertical' | 'circle' | 'cross' | 'diagonal' | 'custom';
}

export interface WinRecord {
  countryId: string;
  countryName: string;
  emoji: string;
  wins: number;
  firstWinRound: number;
}

export const ALL_CONTINENTS = [
  'Africa',
  'Europe',
  'Asia',
  'North America',
  'Oceania',
  'South America',
  'Antarctica',
] as const;

export type Continent = typeof ALL_CONTINENTS[number];

export const COUNTRIES: CountryData[] = [
  // ==========================================
  // AFRICA (54 flags)
  // ==========================================
  { id: 'dz', name: 'Algeria', continent: 'Africa', code: 'DZA', emoji: '🇩🇿', colors: ['#006633', '#ffffff', '#d21034'], flagType: 'vertical' },
  { id: 'ao', name: 'Angola', continent: 'Africa', code: 'AGO', emoji: '🇦🇴', colors: ['#c8102e', '#000000', '#ffd100'], flagType: 'horizontal' },
  { id: 'bj', name: 'Benin', continent: 'Africa', code: 'BEN', emoji: '🇧🇯', colors: ['#008751', '#fcd116', '#e8112d'], flagType: 'vertical' },
  { id: 'bw', name: 'Botswana', continent: 'Africa', code: 'BWA', emoji: '🇧🇼', colors: ['#00cbff', '#ffffff', '#000000'], flagType: 'horizontal' },
  { id: 'bf', name: 'Burkina Faso', continent: 'Africa', code: 'BFA', emoji: '🇧🇫', colors: ['#ef2b2d', '#009e49', '#fcd116'], flagType: 'horizontal' },
  { id: 'bi', name: 'Burundi', continent: 'Africa', code: 'BDI', emoji: '🇧🇮', colors: ['#1eb53a', '#ffffff', '#ce1126'], flagType: 'cross' },
  { id: 'cv', name: 'Cabo Verde', continent: 'Africa', code: 'CPV', emoji: '🇨🇻', colors: ['#003893', '#ffffff', '#cf2027'], flagType: 'horizontal' },
  { id: 'cm', name: 'Cameroon', continent: 'Africa', code: 'CMR', emoji: '🇨🇲', colors: ['#007a5e', '#ce1126', '#fcd116'], flagType: 'vertical' },
  { id: 'cf', name: 'Central African Rep.', continent: 'Africa', code: 'CAF', emoji: '🇨🇫', colors: ['#003082', '#ffffff', '#289728', '#ffce00'], flagType: 'horizontal' },
  { id: 'td', name: 'Chad', continent: 'Africa', code: 'TCD', emoji: '🇹🇩', colors: ['#00205b', '#ffcd00', '#c8102e'], flagType: 'vertical' },
  { id: 'km', name: 'Comoros', continent: 'Africa', code: 'COM', emoji: '🇰🇲', colors: ['#ffd100', '#ffffff', '#ce1126', '#003893'], flagType: 'horizontal' },
  { id: 'cd', name: 'DR Congo', continent: 'Africa', code: 'COD', emoji: '🇨🇩', colors: ['#007fff', '#f7d618', '#ce1126'], flagType: 'diagonal' },
  { id: 'cg', name: 'Rep. of the Congo', continent: 'Africa', code: 'COG', emoji: '🇨🇬', colors: ['#009543', '#fbde4a', '#dc241f'], flagType: 'diagonal' },
  { id: 'ci', name: "Cote d'Ivoire", continent: 'Africa', code: 'CIV', emoji: '🇨🇮', colors: ['#f77f00', '#ffffff', '#009e60'], flagType: 'vertical' },
  { id: 'dj', name: 'Djibouti', continent: 'Africa', code: 'DJI', emoji: '🇩🇯', colors: ['#6ab2e7', '#12ad2b', '#ffffff'], flagType: 'horizontal' },
  { id: 'eg', name: 'Egypt', continent: 'Africa', code: 'EGY', emoji: '🇪🇬', colors: ['#ce1126', '#ffffff', '#000000'], flagType: 'horizontal' },
  { id: 'gq', name: 'Equatorial Guinea', continent: 'Africa', code: 'GNQ', emoji: '🇬🇶', colors: ['#3e9a00', '#ffffff', '#e32118'], flagType: 'horizontal' },
  { id: 'er', name: 'Eritrea', continent: 'Africa', code: 'ERI', emoji: '🇪🇷', colors: ['#1eb53a', '#eb1c24', '#00a3e0'], flagType: 'diagonal' },
  { id: 'sz', name: 'Eswatini', continent: 'Africa', code: 'SWZ', emoji: '🇸🇿', colors: ['#4770cd', '#ffd900', '#b10c0c'], flagType: 'horizontal' },
  { id: 'et', name: 'Ethiopia', continent: 'Africa', code: 'ETH', emoji: '🇪🇹', colors: ['#078930', '#fcdd09', '#da121a'], flagType: 'horizontal' },
  { id: 'ga', name: 'Gabon', continent: 'Africa', code: 'GAB', emoji: '🇬🇦', colors: ['#009e60', '#fcd116', '#3a75c4'], flagType: 'horizontal' },
  { id: 'gm', name: 'Gambia', continent: 'Africa', code: 'GMB', emoji: '🇬🇲', colors: ['#ce1126', '#0c1c8c', '#3ab11f'], flagType: 'horizontal' },
  { id: 'gh', name: 'Ghana', continent: 'Africa', code: 'GHA', emoji: '🇬🇭', colors: ['#006b3f', '#fcd116', '#ce1126'], flagType: 'horizontal' },
  { id: 'gn', name: 'Guinea', continent: 'Africa', code: 'GIN', emoji: '🇬🇳', colors: ['#ce1126', '#fcd116', '#009460'], flagType: 'vertical' },
  { id: 'gw', name: 'Guinea-Bissau', continent: 'Africa', code: 'GNB', emoji: '🇬🇼', colors: ['#ce1126', '#fcd116', '#009e49'], flagType: 'vertical' },
  { id: 'ke', name: 'Kenya', continent: 'Africa', code: 'KEN', emoji: '🇰🇪', colors: ['#000000', '#bb0000', '#006600'], flagType: 'horizontal' },
  { id: 'ls', name: 'Lesotho', continent: 'Africa', code: 'LSO', emoji: '🇱🇸', colors: ['#00209f', '#ffffff', '#009543'], flagType: 'horizontal' },
  { id: 'lr', name: 'Liberia', continent: 'Africa', code: 'LBR', emoji: '🇱🇷', colors: ['#bf0a30', '#ffffff', '#002868'], flagType: 'horizontal' },
  { id: 'ly', name: 'Libya', continent: 'Africa', code: 'LBY', emoji: '🇱🇾', colors: ['#e70013', '#000000', '#239e46'], flagType: 'horizontal' },
  { id: 'mg', name: 'Madagascar', continent: 'Africa', code: 'MDG', emoji: '🇲🇬', colors: ['#ffffff', '#fc3d32', '#007e3a'], flagType: 'vertical' },
  { id: 'mw', name: 'Malawi', continent: 'Africa', code: 'MWI', emoji: '🇲🇼', colors: ['#000000', '#ce1126', '#339e35'], flagType: 'horizontal' },
  { id: 'ml', name: 'Mali', continent: 'Africa', code: 'MLI', emoji: '🇲🇱', colors: ['#14b53a', '#fcd116', '#ce1126'], flagType: 'vertical' },
  { id: 'mr', name: 'Mauritania', continent: 'Africa', code: 'MRT', emoji: '🇲🇷', colors: ['#d01c1f', '#006233', '#ffd700'], flagType: 'horizontal' },
  { id: 'mu', name: 'Mauritius', continent: 'Africa', code: 'MUS', emoji: '🇲🇺', colors: ['#ea2839', '#1a2061', '#ffd700', '#00a04d'], flagType: 'horizontal' },
  { id: 'ma', name: 'Morocco', continent: 'Africa', code: 'MAR', emoji: '🇲🇦', colors: ['#c1272d', '#006233'], flagType: 'circle' },
  { id: 'mz', name: 'Mozambique', continent: 'Africa', code: 'MOZ', emoji: '🇲🇿', colors: ['#009639', '#000000', '#ffd100', '#d21034'], flagType: 'horizontal' },
  { id: 'na', name: 'Namibia', continent: 'Africa', code: 'NAM', emoji: '🇳🇦', colors: ['#003580', '#d21034', '#009543', '#ffd100'], flagType: 'diagonal' },
  { id: 'ne', name: 'Niger', continent: 'Africa', code: 'NER', emoji: '🇳🇪', colors: ['#e05206', '#ffffff', '#0db02b'], flagType: 'horizontal' },
  { id: 'ng', name: 'Nigeria', continent: 'Africa', code: 'NGA', emoji: '🇳🇬', colors: ['#008751', '#ffffff'], flagType: 'vertical' },
  { id: 'rw', name: 'Rwanda', continent: 'Africa', code: 'RWA', emoji: '🇷🇼', colors: ['#20603d', '#fad201', '#00a1de'], flagType: 'horizontal' },
  { id: 'st', name: 'Sao Tome & Principe', continent: 'Africa', code: 'STP', emoji: '🇸🇹', colors: ['#12ad2b', '#ffce00', '#d21034'], flagType: 'horizontal' },
  { id: 'sn', name: 'Senegal', continent: 'Africa', code: 'SEN', emoji: '🇸🇳', colors: ['#00853f', '#fdef42', '#e31b23'], flagType: 'vertical' },
  { id: 'sc', name: 'Seychelles', continent: 'Africa', code: 'SYC', emoji: '🇸🇨', colors: ['#003d88', '#fed141', '#d9232a', '#007a3d'], flagType: 'custom' },
  { id: 'sl', name: 'Sierra Leone', continent: 'Africa', code: 'SLE', emoji: '🇸🇱', colors: ['#1eb53a', '#ffffff', '#0072c6'], flagType: 'horizontal' },
  { id: 'so', name: 'Somalia', continent: 'Africa', code: 'SOM', emoji: '🇸🇴', colors: ['#4189dd', '#ffffff'], flagType: 'custom' },
  { id: 'za', name: 'South Africa', continent: 'Africa', code: 'ZAF', emoji: '🇿🇦', colors: ['#007749', '#e03c31', '#001489', '#ffb612'], flagType: 'horizontal' },
  { id: 'ss', name: 'South Sudan', continent: 'Africa', code: 'SSD', emoji: '🇸🇸', colors: ['#000000', '#e11c2a', '#0f7535', '#0f589c'], flagType: 'horizontal' },
  { id: 'sd', name: 'Sudan', continent: 'Africa', code: 'SDN', emoji: '🇸🇩', colors: ['#d21034', '#ffffff', '#000000', '#007229'], flagType: 'horizontal' },
  { id: 'tz', name: 'Tanzania', continent: 'Africa', code: 'TZA', emoji: '🇹🇿', colors: ['#1eb53a', '#00a3dd', '#000000', '#fcd116'], flagType: 'diagonal' },
  { id: 'tg', name: 'Togo', continent: 'Africa', code: 'TGO', emoji: '🇹🇬', colors: ['#006a4e', '#ffce00', '#d21034'], flagType: 'horizontal' },
  { id: 'tn', name: 'Tunisia', continent: 'Africa', code: 'TUN', emoji: '🇹🇳', colors: ['#e70013', '#ffffff'], flagType: 'circle' },
  { id: 'ug', name: 'Uganda', continent: 'Africa', code: 'UGA', emoji: '🇺🇬', colors: ['#000000', '#fcdc04', '#d90000'], flagType: 'horizontal' },
  { id: 'zm', name: 'Zambia', continent: 'Africa', code: 'ZMB', emoji: '🇿🇲', colors: ['#198a00', '#ef7d00', '#000000', '#de2010'], flagType: 'custom' },
  { id: 'zw', name: 'Zimbabwe', continent: 'Africa', code: 'ZWE', emoji: '🇿🇼', colors: ['#319200', '#ffd200', '#d40000', '#000000'], flagType: 'horizontal' },

  // ==========================================
  // EUROPE (44 flags)
  // ==========================================
  { id: 'al', name: 'Albania', continent: 'Europe', code: 'ALB', emoji: '🇦🇱', colors: ['#e41e20', '#000000'], flagType: 'custom' },
  { id: 'ad', name: 'Andorra', continent: 'Europe', code: 'AND', emoji: '🇦🇩', colors: ['#10069f', '#fed100', '#d50032'], flagType: 'vertical' },
  { id: 'at', name: 'Austria', continent: 'Europe', code: 'AUT', emoji: '🇦🇹', colors: ['#ed2939', '#ffffff'], flagType: 'horizontal' },
  { id: 'by', name: 'Belarus', continent: 'Europe', code: 'BLR', emoji: '🇧🇾', colors: ['#c8313e', '#4aa658'], flagType: 'horizontal' },
  { id: 'be', name: 'Belgium', continent: 'Europe', code: 'BEL', emoji: '🇧🇪', colors: ['#000000', '#ffd90c', '#f31830'], flagType: 'vertical' },
  { id: 'ba', name: 'Bosnia & Herz.', continent: 'Europe', code: 'BIH', emoji: '🇧🇦', colors: ['#002395', '#fecb00', '#ffffff'], flagType: 'diagonal' },
  { id: 'bg', name: 'Bulgaria', continent: 'Europe', code: 'BGR', emoji: '🇧🇬', colors: ['#ffffff', '#00966e', '#d62612'], flagType: 'horizontal' },
  { id: 'hr', name: 'Croatia', continent: 'Europe', code: 'HRV', emoji: '🇭🇷', colors: ['#ff0000', '#ffffff', '#171796'], flagType: 'horizontal' },
  { id: 'cz', name: 'Czechia', continent: 'Europe', code: 'CZE', emoji: '🇨🇿', colors: ['#ffffff', '#d7141a', '#11457e'], flagType: 'custom' },
  { id: 'dk', name: 'Denmark', continent: 'Europe', code: 'DNK', emoji: '🇩🇰', colors: ['#c60c30', '#ffffff'], flagType: 'cross' },
  { id: 'ee', name: 'Estonia', continent: 'Europe', code: 'EST', emoji: '🇪🇪', colors: ['#0072ce', '#000000', '#ffffff'], flagType: 'horizontal' },
  { id: 'fi', name: 'Finland', continent: 'Europe', code: 'FIN', emoji: '🇫🇮', colors: ['#ffffff', '#003580'], flagType: 'cross' },
  { id: 'fr', name: 'France', continent: 'Europe', code: 'FRA', emoji: '🇫🇷', colors: ['#0055a4', '#ffffff', '#ef4135'], flagType: 'vertical' },
  { id: 'de', name: 'Germany', continent: 'Europe', code: 'DEU', emoji: '🇩🇪', colors: ['#000000', '#dd0000', '#ffce00'], flagType: 'horizontal' },
  { id: 'gr', name: 'Greece', continent: 'Europe', code: 'GRC', emoji: '🇬🇷', colors: ['#0d5eaf', '#ffffff'], flagType: 'horizontal' },
  { id: 'hu', name: 'Hungary', continent: 'Europe', code: 'HUN', emoji: '🇭🇺', colors: ['#ce2939', '#ffffff', '#477050'], flagType: 'horizontal' },
  { id: 'is', name: 'Iceland', continent: 'Europe', code: 'ISL', emoji: '🇮🇸', colors: ['#02529c', '#dc1e35', '#ffffff'], flagType: 'cross' },
  { id: 'ie', name: 'Ireland', continent: 'Europe', code: 'IRL', emoji: '🇮🇪', colors: ['#169b62', '#ffffff', '#ff883e'], flagType: 'vertical' },
  { id: 'it', name: 'Italy', continent: 'Europe', code: 'ITA', emoji: '🇮🇹', colors: ['#009246', '#ffffff', '#ce2b37'], flagType: 'vertical' },
  { id: 'lv', name: 'Latvia', continent: 'Europe', code: 'LVA', emoji: '🇱🇻', colors: ['#9e3039', '#ffffff'], flagType: 'horizontal' },
  { id: 'li', name: 'Liechtenstein', continent: 'Europe', code: 'LIE', emoji: '🇱🇮', colors: ['#002b7f', '#ce1126'], flagType: 'horizontal' },
  { id: 'lt', name: 'Lithuania', continent: 'Europe', code: 'LTU', emoji: '🇱🇹', colors: ['#fdb913', '#006a44', '#c1272d'], flagType: 'horizontal' },
  { id: 'lu', name: 'Luxembourg', continent: 'Europe', code: 'LUX', emoji: '🇱🇺', colors: ['#ea141d', '#ffffff', '#00a1de'], flagType: 'horizontal' },
  { id: 'mt', name: 'Malta', continent: 'Europe', code: 'MLT', emoji: '🇲🇱', colors: ['#ffffff', '#c1272d'], flagType: 'vertical' },
  { id: 'md', name: 'Moldova', continent: 'Europe', code: 'MDA', emoji: '🇲🇩', colors: ['#003893', '#ffd100', '#cc092f'], flagType: 'vertical' },
  { id: 'mc', name: 'Monaco', continent: 'Europe', code: 'MCO', emoji: '🇲🇨', colors: ['#ce1126', '#ffffff'], flagType: 'horizontal' },
  { id: 'me', name: 'Montenegro', continent: 'Europe', code: 'MNE', emoji: '🇲🇪', colors: ['#c40308', '#d4af37'], flagType: 'custom' },
  { id: 'nl', name: 'Netherlands', continent: 'Europe', code: 'NLD', emoji: '🇳🇱', colors: ['#ae1c28', '#ffffff', '#21468b'], flagType: 'horizontal' },
  { id: 'mk', name: 'North Macedonia', continent: 'Europe', code: 'MKD', emoji: '🇲🇰', colors: ['#d82126', '#f8e92e'], flagType: 'custom' },
  { id: 'no', name: 'Norway', continent: 'Europe', code: 'NOR', emoji: '🇳🇴', colors: ['#ba0c2f', '#00205b', '#ffffff'], flagType: 'cross' },
  { id: 'pl', name: 'Poland', continent: 'Europe', code: 'POL', emoji: '🇵🇱', colors: ['#ffffff', '#dc143c'], flagType: 'horizontal' },
  { id: 'pt', name: 'Portugal', continent: 'Europe', code: 'PRT', emoji: '🇵🇹', colors: ['#046a38', '#da291c'], flagType: 'vertical' },
  { id: 'ro', name: 'Romania', continent: 'Europe', code: 'ROU', emoji: '🇷🇴', colors: ['#002b7f', '#fcd116', '#ce1126'], flagType: 'vertical' },
  { id: 'ru', name: 'Russia', continent: 'Europe', code: 'RUS', emoji: '🇷🇺', colors: ['#ffffff', '#0039a6', '#d52b1e'], flagType: 'horizontal' },
  { id: 'sm', name: 'San Marino', continent: 'Europe', code: 'SMR', emoji: '🇸🇲', colors: ['#ffffff', '#5eb6e4'], flagType: 'horizontal' },
  { id: 'rs', name: 'Serbia', continent: 'Europe', code: 'SRB', emoji: '🇷🇸', colors: ['#c6363c', '#0c4076', '#ffffff'], flagType: 'horizontal' },
  { id: 'sk', name: 'Slovakia', continent: 'Europe', code: 'SVK', emoji: '🇸🇰', colors: ['#ffffff', '#0b4ea2', '#ee1c25'], flagType: 'horizontal' },
  { id: 'si', name: 'Slovenia', continent: 'Europe', code: 'SVN', emoji: '🇸🇮', colors: ['#ffffff', '#005ce6', '#ed1c24'], flagType: 'horizontal' },
  { id: 'es', name: 'Spain', continent: 'Europe', code: 'ESP', emoji: '🇪🇸', colors: ['#aa151b', '#f1bf00'], flagType: 'horizontal' },
  { id: 'se', name: 'Sweden', continent: 'Europe', code: 'SWE', emoji: '🇸🇪', colors: ['#006aa7', '#fecc00'], flagType: 'cross' },
  { id: 'ch', name: 'Switzerland', continent: 'Europe', code: 'CHE', emoji: '🇨🇭', colors: ['#ff0000', '#ffffff'], flagType: 'cross' },
  { id: 'ua', name: 'Ukraine', continent: 'Europe', code: 'UKR', emoji: '🇺🇦', colors: ['#0057b7', '#ffd700'], flagType: 'horizontal' },
  { id: 'gb', name: 'United Kingdom', continent: 'Europe', code: 'GBR', emoji: '🇬🇧', colors: ['#012169', '#c8102e', '#ffffff'], flagType: 'cross' },
  { id: 'va', name: 'Vatican City', continent: 'Europe', code: 'VAT', emoji: '🇻🇦', colors: ['#ffe000', '#ffffff'], flagType: 'vertical' },

  // ==========================================
  // ASIA (48 flags, including Palestine)
  // ==========================================
  { id: 'af', name: 'Afghanistan', continent: 'Asia', code: 'AFG', emoji: '🇦🇫', colors: ['#000000', '#d32011', '#007a36'], flagType: 'vertical' },
  { id: 'am', name: 'Armenia', continent: 'Asia', code: 'ARM', emoji: '🇦🇲', colors: ['#d90012', '#0033a0', '#f2a800'], flagType: 'horizontal' },
  { id: 'az', name: 'Azerbaijan', continent: 'Asia', code: 'AZE', emoji: '🇦🇿', colors: ['#00b5e2', '#ef3340', '#509e2f'], flagType: 'horizontal' },
  { id: 'bh', name: 'Bahrain', continent: 'Asia', code: 'BHR', emoji: '🇧🇭', colors: ['#ffffff', '#ce1126'], flagType: 'vertical' },
  { id: 'bd', name: 'Bangladesh', continent: 'Asia', code: 'BGD', emoji: '🇧🇩', colors: ['#006a4e', '#f42a41'], flagType: 'circle' },
  { id: 'bt', name: 'Bhutan', continent: 'Asia', code: 'BTN', emoji: '🇧🇹', colors: ['#ff4e12', '#ffd520'], flagType: 'diagonal' },
  { id: 'bn', name: 'Brunei', continent: 'Asia', code: 'BRN', emoji: '🇧🇳', colors: ['#f7e017', '#ffffff', '#000000'], flagType: 'diagonal' },
  { id: 'kh', name: 'Cambodia', continent: 'Asia', code: 'KHM', emoji: '🇰🇭', colors: ['#032ea1', '#e00025'], flagType: 'horizontal' },
  { id: 'cn', name: 'China', continent: 'Asia', code: 'CHN', emoji: '🇨🇳', colors: ['#de2910', '#ffde00'], flagType: 'custom' },
  { id: 'cy', name: 'Cyprus', continent: 'Asia', code: 'CYP', emoji: '🇨🇾', colors: ['#ffffff', '#d47600', '#4e6e2f'], flagType: 'custom' },
  { id: 'ge', name: 'Georgia', continent: 'Asia', code: 'GEO', emoji: '🇬🇪', colors: ['#ffffff', '#ff0000'], flagType: 'cross' },
  { id: 'in', name: 'India', continent: 'Asia', code: 'IND', emoji: '🇮🇳', colors: ['#ff9933', '#ffffff', '#128807'], flagType: 'horizontal' },
  { id: 'id', name: 'Indonesia', continent: 'Asia', code: 'IDN', emoji: '🇮🇩', colors: ['#ff0000', '#ffffff'], flagType: 'horizontal' },
  { id: 'ir', name: 'Iran', continent: 'Asia', code: 'IRN', emoji: '🇮🇷', colors: ['#239f40', '#ffffff', '#da0000'], flagType: 'horizontal' },
  { id: 'iq', name: 'Iraq', continent: 'Asia', code: 'IRQ', emoji: '🇮🇶', colors: ['#ce1126', '#ffffff', '#000000'], flagType: 'horizontal' },
  { id: 'il', name: 'Israel', continent: 'Asia', code: 'ISR', emoji: '🇮🇱', colors: ['#ffffff', '#0038b8'], flagType: 'horizontal' },
  { id: 'jp', name: 'Japan', continent: 'Asia', code: 'JPN', emoji: '🇯🇵', colors: ['#ffffff', '#bc002d'], flagType: 'circle' },
  { id: 'jo', name: 'Jordan', continent: 'Asia', code: 'JOR', emoji: '🇯🇴', colors: ['#000000', '#ffffff', '#007a3d', '#ce1126'], flagType: 'horizontal' },
  { id: 'kz', name: 'Kazakhstan', continent: 'Asia', code: 'KAZ', emoji: '🇰🇿', colors: ['#00afca', '#fec50c'], flagType: 'custom' },
  { id: 'kw', name: 'Kuwait', continent: 'Asia', code: 'KWT', emoji: '🇰🇼', colors: ['#007a3d', '#ffffff', '#ce1126', '#000000'], flagType: 'horizontal' },
  { id: 'kg', name: 'Kyrgyzstan', continent: 'Asia', code: 'KGZ', emoji: '🇰🇬', colors: ['#e8112d', '#ffe300'], flagType: 'circle' },
  { id: 'la', name: 'Laos', continent: 'Asia', code: 'LAO', emoji: '🇱🇦', colors: ['#ce1126', '#002868', '#ffffff'], flagType: 'circle' },
  { id: 'lb', name: 'Lebanon', continent: 'Asia', code: 'LBN', emoji: '🇱🇧', colors: ['#ed1c24', '#ffffff', '#00a651'], flagType: 'horizontal' },
  { id: 'my', name: 'Malaysia', continent: 'Asia', code: 'MYS', emoji: '🇲🇾', colors: ['#cc0000', '#ffffff', '#010066', '#ffcc00'], flagType: 'horizontal' },
  { id: 'mv', name: 'Maldives', continent: 'Asia', code: 'MDV', emoji: '🇲🇻', colors: ['#d21034', '#007e3a', '#ffffff'], flagType: 'custom' },
  { id: 'mn', name: 'Mongolia', continent: 'Asia', code: 'MNG', emoji: '🇲🇳', colors: ['#e4002b', '#0066b2', '#f6d500'], flagType: 'vertical' },
  { id: 'mm', name: 'Myanmar', continent: 'Asia', code: 'MMR', emoji: '🇲🇲', colors: ['#fecb00', '#34b233', '#ea2839'], flagType: 'horizontal' },
  { id: 'np', name: 'Nepal', continent: 'Asia', code: 'NPL', emoji: '🇳🇵', colors: ['#dc143c', '#003893', '#ffffff'], flagType: 'custom' },
  { id: 'kp', name: 'North Korea', continent: 'Asia', code: 'PRK', emoji: '🇰🇵', colors: ['#ed1b2f', '#024fa2', '#ffffff'], flagType: 'horizontal' },
  { id: 'om', name: 'Oman', continent: 'Asia', code: 'OMN', emoji: '🇴🇲', colors: ['#db161b', '#ffffff', '#008000'], flagType: 'horizontal' },
  { id: 'pk', name: 'Pakistan', continent: 'Asia', code: 'PAK', emoji: '🇵🇰', colors: ['#01411c', '#ffffff'], flagType: 'vertical' },
  { id: 'ps', name: 'Palestine', continent: 'Asia', code: 'PSE', emoji: '🇵🇸', colors: ['#000000', '#ffffff', '#007a3d', '#ce1126'], flagType: 'horizontal' },
  { id: 'ph', name: 'Philippines', continent: 'Asia', code: 'PHL', emoji: '🇵🇭', colors: ['#0038a8', '#ce1126', '#ffffff'], flagType: 'horizontal' },
  { id: 'qa', name: 'Qatar', continent: 'Asia', code: 'QAT', emoji: '🇶🇦', colors: ['#ffffff', '#8d1b3d'], flagType: 'vertical' },
  { id: 'sa', name: 'Saudi Arabia', continent: 'Asia', code: 'SAU', emoji: '🇸🇦', colors: ['#006c35', '#ffffff'], flagType: 'custom' },
  { id: 'sg', name: 'Singapore', continent: 'Asia', code: 'SGP', emoji: '🇸🇬', colors: ['#ed2939', '#ffffff'], flagType: 'horizontal' },
  { id: 'kr', name: 'South Korea', continent: 'Asia', code: 'KOR', emoji: '🇰🇷', colors: ['#ffffff', '#cd2e3a', '#0047a0'], flagType: 'circle' },
  { id: 'lk', name: 'Sri Lanka', continent: 'Asia', code: 'LKA', emoji: '🇱🇰', colors: ['#8d153a', '#ffbe29', '#00534e', '#eb7400'], flagType: 'custom' },
  { id: 'sy', name: 'Syria', continent: 'Asia', code: 'SYR', emoji: '🇸🇾', colors: ['#ce1126', '#ffffff', '#000000', '#007a3d'], flagType: 'horizontal' },
  { id: 'tj', name: 'Tajikistan', continent: 'Asia', code: 'TJK', emoji: '🇹🇯', colors: ['#cc0000', '#ffffff', '#006600', '#f8c300'], flagType: 'horizontal' },
  { id: 'th', name: 'Thailand', continent: 'Asia', code: 'THA', emoji: '🇹🇭', colors: ['#a51931', '#f4f5f8', '#2d2a4a'], flagType: 'horizontal' },
  { id: 'tl', name: 'Timor-Leste', continent: 'Asia', code: 'TLS', emoji: '🇹🇱', colors: ['#dc241f', '#000000', '#ffc726', '#ffffff'], flagType: 'custom' },
  { id: 'tr', name: 'Turkey', continent: 'Asia', code: 'TUR', emoji: '🇹🇷', colors: ['#e30a17', '#ffffff'], flagType: 'custom' },
  { id: 'tm', name: 'Turkmenistan', continent: 'Asia', code: 'TKM', emoji: '🇹🇲', colors: ['#2e8540', '#d22630', '#ffffff'], flagType: 'custom' },
  { id: 'ae', name: 'UAE', continent: 'Asia', code: 'ARE', emoji: '🇦🇪', colors: ['#00732f', '#ffffff', '#000000', '#ff0000'], flagType: 'horizontal' },
  { id: 'uz', name: 'Uzbekistan', continent: 'Asia', code: 'UZB', emoji: '🇺🇿', colors: ['#0099b5', '#ffffff', '#1eb53a', '#ce1126'], flagType: 'horizontal' },
  { id: 'vn', name: 'Vietnam', continent: 'Asia', code: 'VNM', emoji: '🇻🇳', colors: ['#da251d', '#ffff00'], flagType: 'circle' },
  { id: 'ye', name: 'Yemen', continent: 'Asia', code: 'YEM', emoji: '🇾🇪', colors: ['#ce1126', '#ffffff', '#000000'], flagType: 'horizontal' },

  // ==========================================
  // NORTH AMERICA (23 flags)
  // ==========================================
  { id: 'ag', name: 'Antigua & Barbuda', continent: 'North America', code: 'ATG', emoji: '🇦🇬', colors: ['#ce1126', '#000000', '#0072c6', '#ffffff'], flagType: 'custom' },
  { id: 'bs', name: 'Bahamas', continent: 'North America', code: 'BHS', emoji: '🇧🇸', colors: ['#00778b', '#ffc72c', '#000000'], flagType: 'horizontal' },
  { id: 'bb', name: 'Barbados', continent: 'North America', code: 'BRB', emoji: '🇧🇧', colors: ['#00267f', '#ffc726', '#000000'], flagType: 'vertical' },
  { id: 'bz', name: 'Belize', continent: 'North America', code: 'BLZ', emoji: '🇧🇿', colors: ['#003f87', '#d91023', '#ffffff'], flagType: 'horizontal' },
  { id: 'ca', name: 'Canada', continent: 'North America', code: 'CAN', emoji: '🇨🇦', colors: ['#ff0000', '#ffffff'], flagType: 'vertical' },
  { id: 'cr', name: 'Costa Rica', continent: 'North America', code: 'CRI', emoji: '🇨🇷', colors: ['#002b7f', '#ffffff', '#ce1126'], flagType: 'horizontal' },
  { id: 'cu', name: 'Cuba', continent: 'North America', code: 'CUB', emoji: '🇨🇺', colors: ['#002a8f', '#ffffff', '#cf142b'], flagType: 'horizontal' },
  { id: 'dm', name: 'Dominica', continent: 'North America', code: 'DMA', emoji: '🇩🇲', colors: ['#006b3f', '#fed100', '#ffffff', '#d4111e'], flagType: 'cross' },
  { id: 'do', name: 'Dominican Rep.', continent: 'North America', code: 'DOM', emoji: '🇩🇴', colors: ['#002f6c', '#ce1126', '#ffffff'], flagType: 'cross' },
  { id: 'sv', name: 'El Salvador', continent: 'North America', code: 'SLV', emoji: '🇸🇻', colors: ['#0f47af', '#ffffff'], flagType: 'horizontal' },
  { id: 'gd', name: 'Grenada', continent: 'North America', code: 'GRD', emoji: '🇬🇩', colors: ['#ce1126', '#fcd116', '#007a3d'], flagType: 'custom' },
  { id: 'gt', name: 'Guatemala', continent: 'North America', code: 'GTM', emoji: '🇬🇹', colors: ['#4997d0', '#ffffff'], flagType: 'vertical' },
  { id: 'ht', name: 'Haiti', continent: 'North America', code: 'HTI', emoji: '🇭🇹', colors: ['#00209f', '#d21034'], flagType: 'horizontal' },
  { id: 'hn', name: 'Honduras', continent: 'North America', code: 'HND', emoji: '🇭🇳', colors: ['#0073cf', '#ffffff'], flagType: 'horizontal' },
  { id: 'jm', name: 'Jamaica', continent: 'North America', code: 'JAM', emoji: '🇯🇲', colors: ['#009b3a', '#fed100', '#000000'], flagType: 'diagonal' },
  { id: 'mx', name: 'Mexico', continent: 'North America', code: 'MEX', emoji: '🇲🇽', colors: ['#006847', '#ffffff', '#ce1126'], flagType: 'vertical' },
  { id: 'ni', name: 'Nicaragua', continent: 'North America', code: 'NIC', emoji: '🇳🇮', colors: ['#0067c6', '#ffffff'], flagType: 'horizontal' },
  { id: 'pa', name: 'Panama', continent: 'North America', code: 'PAN', emoji: '🇵🇦', colors: ['#005293', '#d21034', '#ffffff'], flagType: 'custom' },
  { id: 'kn', name: 'Saint Kitts & Nevis', continent: 'North America', code: 'KNA', emoji: '🇰🇳', colors: ['#009e49', '#ce1126', '#000000', '#fcd116'], flagType: 'diagonal' },
  { id: 'lc', name: 'Saint Lucia', continent: 'North America', code: 'LCA', emoji: '🇱🇨', colors: ['#65cfff', '#ffffff', '#000000', '#ffcf00'], flagType: 'custom' },
  { id: 'vc', name: 'St. Vincent & Grenadines', continent: 'North America', code: 'VCT', emoji: '🇻🇨', colors: ['#00267f', '#fed100', '#009e49'], flagType: 'vertical' },
  { id: 'tt', name: 'Trinidad & Tobago', continent: 'North America', code: 'TTO', emoji: '🇹🇹', colors: ['#ce1126', '#ffffff', '#000000'], flagType: 'diagonal' },
  { id: 'us', name: 'United States', continent: 'North America', code: 'USA', emoji: '🇺🇸', colors: ['#b22234', '#ffffff', '#3c3b6e'], flagType: 'horizontal' },

  // ==========================================
  // OCEANIA (14 flags)
  // ==========================================
  { id: 'au', name: 'Australia', continent: 'Oceania', code: 'AUS', emoji: '🇦🇺', colors: ['#00008b', '#ff0000', '#ffffff'], flagType: 'custom' },
  { id: 'fj', name: 'Fiji', continent: 'Oceania', code: 'FJI', emoji: '🇫🇯', colors: ['#68bfe5', '#ffffff', '#cc142b'], flagType: 'custom' },
  { id: 'ki', name: 'Kiribati', continent: 'Oceania', code: 'KIR', emoji: '🇰🇮', colors: ['#cf142b', '#00247d', '#ffffff', '#fcd116'], flagType: 'horizontal' },
  { id: 'mh', name: 'Marshall Islands', continent: 'Oceania', code: 'MHL', emoji: '🇲🇭', colors: ['#003893', '#dd7500', '#ffffff'], flagType: 'diagonal' },
  { id: 'fm', name: 'Micronesia', continent: 'Oceania', code: 'FSM', emoji: '🇫🇲', colors: ['#4d8cd3', '#ffffff'], flagType: 'custom' },
  { id: 'nr', name: 'Nauru', continent: 'Oceania', code: 'NRU', emoji: '🇳🇷', colors: ['#002b7f', '#ffc72c', '#ffffff'], flagType: 'horizontal' },
  { id: 'nz', name: 'New Zealand', continent: 'Oceania', code: 'NZL', emoji: '🇳🇿', colors: ['#00247d', '#cc142b', '#ffffff'], flagType: 'custom' },
  { id: 'pw', name: 'Palau', continent: 'Oceania', code: 'PLW', emoji: '🇵🇼', colors: ['#4aadd6', '#ffde00'], flagType: 'circle' },
  { id: 'pg', name: 'Papua New Guinea', continent: 'Oceania', code: 'PNG', emoji: '🇵🇬', colors: ['#000000', '#ce1126', '#fcd116', '#ffffff'], flagType: 'diagonal' },
  { id: 'ws', name: 'Samoa', continent: 'Oceania', code: 'WSM', emoji: '🇼🇸', colors: ['#ce1126', '#002b7f', '#ffffff'], flagType: 'custom' },
  { id: 'sb', name: 'Solomon Islands', continent: 'Oceania', code: 'SLB', emoji: '🇸🇧', colors: ['#0051ba', '#21963f', '#fcd116', '#ffffff'], flagType: 'diagonal' },
  { id: 'to', name: 'Tonga', continent: 'Oceania', code: 'TON', emoji: '🇹🇴', colors: ['#c10000', '#ffffff'], flagType: 'custom' },
  { id: 'tv', name: 'Tuvalu', continent: 'Oceania', code: 'TUV', emoji: '🇹🇻', colors: ['#5b97c9', '#ffffff', '#ffcc00', '#cf142b'], flagType: 'custom' },
  { id: 'vu', name: 'Vanuatu', continent: 'Oceania', code: 'VUT', emoji: '🇻🇺', colors: ['#d21034', '#009543', '#000000', '#fdce12'], flagType: 'horizontal' },

  // ==========================================
  // SOUTH AMERICA (12 flags)
  // ==========================================
  { id: 'ar', name: 'Argentina', continent: 'South America', code: 'ARG', emoji: '🇦🇷', colors: ['#74acdf', '#ffffff'], flagType: 'horizontal' },
  { id: 'bo', name: 'Bolivia', continent: 'South America', code: 'BOL', emoji: '🇧🇴', colors: ['#d52b1e', '#f9e300', '#007934'], flagType: 'horizontal' },
  { id: 'br', name: 'Brazil', continent: 'South America', code: 'BRA', emoji: '🇧🇷', colors: ['#009b3a', '#fedf00', '#002776'], flagType: 'custom' },
  { id: 'cl', name: 'Chile', continent: 'South America', code: 'CHL', emoji: '🇨🇱', colors: ['#0039a6', '#ffffff', '#d52b1e'], flagType: 'horizontal' },
  { id: 'co', name: 'Colombia', continent: 'South America', code: 'COL', emoji: '🇨🇴', colors: ['#fcd116', '#003893', '#ce1126'], flagType: 'horizontal' },
  { id: 'ec', name: 'Ecuador', continent: 'South America', code: 'ECU', emoji: '🇪🇨', colors: ['#ffdd00', '#034ea2', '#ed1c24'], flagType: 'horizontal' },
  { id: 'gy', name: 'Guyana', continent: 'South America', code: 'GUY', emoji: '🇬🇾', colors: ['#009e49', '#fcd116', '#ce1126', '#ffffff'], flagType: 'diagonal' },
  { id: 'py', name: 'Paraguay', continent: 'South America', code: 'PRY', emoji: '🇵🇾', colors: ['#d52b1e', '#ffffff', '#0038a8'], flagType: 'horizontal' },
  { id: 'pe', name: 'Peru', continent: 'South America', code: 'PER', emoji: '🇵🇪', colors: ['#d91023', '#ffffff'], flagType: 'vertical' },
  { id: 'sr', name: 'Suriname', continent: 'South America', code: 'SUR', emoji: '🇸🇷', colors: ['#377e3f', '#b40a2d', '#ffffff', '#ecc81d'], flagType: 'horizontal' },
  { id: 'uy', name: 'Uruguay', continent: 'South America', code: 'URY', emoji: '🇺🇾', colors: ['#0038a8', '#ffffff', '#fcd116'], flagType: 'horizontal' },
  { id: 've', name: 'Venezuela', continent: 'South America', code: 'VEN', emoji: '🇻🇪', colors: ['#ffcc00', '#00247d', '#cf142b'], flagType: 'horizontal' },

  // ==========================================
  // ANTARCTICA (1 flag) - Solid Full-White Flag
  // ==========================================
  { id: 'aq', name: 'Antarctica', continent: 'Antarctica', code: 'ATA', emoji: '🇦🇶', colors: ['#ffffff', '#ffffff'], flagType: 'custom' }
];

/**
 * Returns exact counts per continent.
 */
export function getContinentCountryCounts(): Record<Continent, number> {
  const counts: Record<string, number> = {
    'Africa': 0,
    'Europe': 0,
    'Asia': 0,
    'North America': 0,
    'Oceania': 0,
    'South America': 0,
    'Antarctica': 0,
  };
  for (const c of COUNTRIES) {
    counts[c.continent] = (counts[c.continent] || 0) + 1;
  }
  return counts as Record<Continent, number>;
}

/**
 * Filter countries based on a set or array of enabled continents.
 * If empty, returns all countries as fallback so game never crashes.
 */
export function filterCountriesByContinents(
  continents: Iterable<string> | Set<string> | string[]
): CountryData[] {
  const set = new Set(continents);
  if (set.size === 0) {
    return [...COUNTRIES];
  }
  const filtered = COUNTRIES.filter((c) => set.has(c.continent));
  return filtered.length > 0 ? filtered : [...COUNTRIES];
}

/**
 * Format elapsed seconds into MM:SS format with leading zeros.
 */
export function formatSessionTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Sorts and truncates win records into top 10 leaderboard.
 * Primary sort: highest wins descending.
 * Tie-breaker: chronological order (firstWinRound ascending).
 */
export function computeLeaderboard(
  winsMap: Map<string, WinRecord> | Record<string, WinRecord>
): WinRecord[] {
  const records: WinRecord[] = winsMap instanceof Map 
    ? Array.from(winsMap.values())
    : Object.values(winsMap);

  return records
    .filter((r) => r.wins > 0)
    .sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return a.firstWinRound - b.firstWinRound;
    })
    .slice(0, 10);
}

/**
 * Normalizes an angle to [0, 2*PI).
 */
export function normalizeAngle(angle: number): number {
  const twoPi = Math.PI * 2;
  let a = angle % twoPi;
  if (a < 0) a += twoPi;
  return a;
}

/**
 * Determines whether an angle in radians falls inside the rotating gap.
 * @param entityAngle Angle of the entity from the arena center (radians).
 * @param ringAngle Current rotation of the ring (radians).
 * @param gapAngle Center of gap relative to ring base (radians).
 * @param gapWidth Angular width of gap (radians).
 */
export function isAngleInGap(
  entityAngle: number,
  ringAngle: number,
  gapAngle: number = 0,
  gapWidth: number = Math.PI / 8.4 // Narrow single exit gap (~21.4 deg)
): boolean {
  const normEntity = normalizeAngle(entityAngle);
  const centerOfGap = normalizeAngle(ringAngle + gapAngle);
  const halfGap = gapWidth / 2;

  // Angular difference between entity and center of gap
  let diff = Math.abs(normEntity - centerOfGap);
  if (diff > Math.PI) {
    diff = Math.PI * 2 - diff;
  }
  return diff <= halfGap;
}

/**
 * Checks whether a flag body has fully passed through the exit gap
 * and completely cleared the outer perimeter ring thickness.
 * Elimination only triggers after this check returns true.
 */
export function checkExitGapCleared(
  entityDist: number,
  entityRadius: number,
  ringRadius: number,
  outerPerimeterMargin: number = 6
): boolean {
  // Inner edge of flag (entityDist - entityRadius) must exceed the ring radius + margin
  return (entityDist - entityRadius) >= (ringRadius + outerPerimeterMargin);
}

/**
 * Resolves Magic Shield absorption.
 * Returns true if shield absorbed the hit (breaks shield), false if vulnerable.
 */
export function resolveShieldAbsorption(
  entity: { hasShield: boolean }
): boolean {
  if (entity.hasShield) {
    entity.hasShield = false;
    return true; // Absorbed! Flag is immune from this hit.
  }
  return false; // Vulnerable: takes hit.
}

/**
 * Computes aim angle in radians from source to target.
 */
export function computeTargetAngle(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): number {
  return Math.atan2(targetY - sourceY, targetX - sourceX);
}

/**
 * Finds the closest living opponent for cannon targeting.
 */
export function findNearestOpponent<T extends { x: number; y: number; isEliminated: boolean; id?: string }>(
  shooter: { x: number; y: number; id?: string },
  entities: T[]
): T | null {
  let nearest: T | null = null;
  let minDist = Infinity;

  for (const ent of entities) {
    if (ent === (shooter as unknown as T) || ent.isEliminated || (shooter.id && ent.id === shooter.id)) continue;
    const dist = Math.hypot(ent.x - shooter.x, ent.y - shooter.y);
    if (dist < minDist) {
      minDist = dist;
      nearest = ent;
    }
  }
  return nearest;
}

/**
 * Resolves 2D elastic collision between two circular-approximated bodies.
 */
export function resolveElasticCollision(
  p1: { x: number; y: number; vx: number; vy: number; mass: number; radius: number },
  p2: { x: number; y: number; vx: number; vy: number; mass: number; radius: number },
  restitution: number = 0.95
): boolean {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.hypot(dx, dy);
  const minDist = p1.radius + p2.radius;

  if (dist >= minDist || dist === 0) {
    return false;
  }

  // Normal vector
  const nx = dx / dist;
  const ny = dy / dist;

  // Separate overlapping bodies
  const overlap = minDist - dist;
  const totalMass = p1.mass + p2.mass;
  p1.x -= nx * overlap * (p2.mass / totalMass);
  p1.y -= ny * overlap * (p2.mass / totalMass);
  p2.x += nx * overlap * (p1.mass / totalMass);
  p2.y += ny * overlap * (p1.mass / totalMass);

  // Relative velocity
  const kx = p1.vx - p2.vx;
  const ky = p1.vy - p2.vy;
  const p = 2 * (nx * kx + ny * ky) / totalMass;

  // Update velocities
  p1.vx -= p * p2.mass * nx * restitution;
  p1.vy -= p * p2.mass * ny * restitution;
  p2.vx += p * p1.mass * nx * restitution;
  p2.vy += p * p1.mass * ny * restitution;

  return true;
}

export const SPEED_PRESETS = [0.5, 1, 1.5, 2] as const;
export type SpeedPreset = typeof SPEED_PRESETS[number];

/**
 * Returns the next simulation speed in the cycle [0.5 -> 1 -> 1.5 -> 2 -> 0.5].
 */
export function getNextSpeed(current: number): number {
  if (current >= 2) return 0.5;
  if (current >= 1.5) return 2;
  if (current >= 1) return 1.5;
  return 1;
}

/**
 * Cannon Power-Up parameters: 2 shots, 0.5s interval
 */
export const CANNON_MAX_SHOTS = 2;
export const CANNON_SHOT_INTERVAL = 0.5;

