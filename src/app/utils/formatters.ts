import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { marked } from 'marked';
import type { PlayerName } from '../types';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

// TODO: Replace 'any' types below with richer domain models once shared types are introduced.
export const formatSeriesStatus = (game: any, rightRail: any): string => {
  const { homeTeamWins, awayTeamWins, neededToWin } = rightRail.seasonSeriesWins;
  const isTied = homeTeamWins === awayTeamWins;

  if (isTied) {
    if (homeTeamWins === 0) {
      return '';
    }

    return 'Series tied.';
  }

  const leadingTeam = homeTeamWins > awayTeamWins ? game.homeTeam : game.awayTeam;
  const leadingWins = homeTeamWins > awayTeamWins ? homeTeamWins : awayTeamWins;
  const trailingWins = homeTeamWins > awayTeamWins ? awayTeamWins : homeTeamWins;

  const status = neededToWin === leadingWins ? 'wins' : 'leads';

  return `${leadingTeam.placeName.default} ${status} ${leadingWins}-${trailingWins}`;
};

export const formatBroadcasts = (
  broadcasts: Array<{ network: string; market: string }> | undefined | null
): string => {
  if (!broadcasts || broadcasts.length === 0) {
    return 'No Broadcasts';
  }

  return broadcasts.map((b) => `${b.network} (${b.market})`).join(', ');
};

export const formatLocalizedDate = (
  dateString: string | number | Date | undefined,
  format: string = 'l'
): string => {
  return dayjs(dateString).utc(true).format(format);
};

export const formatLocalizedTime = (timeString: string | number | Date | undefined): string => {
  return dayjs(timeString).utc(true).format('LT z');
};

export const formatStat = (
  value: number | string | undefined,
  precision?: number,
  unit?: 'start' | 'time' | 'plusMinus' | string
): string | number => {
  if (unit === 'start') {
    return value ? 'Yes' : 'No';
  }

  if (unit === 'time') {
    return formatSecondsToGameTime(value);
  }

  const numeric = typeof value === 'number' ? value : Number(value);

  if (precision) {
    if (value === undefined || value === null || value === '') {
      return '--';
    }

    if (Number.isNaN(numeric)) {
      return '--';
    }
    if (numeric === 1) {
      return '1.000';
    }

    return numeric.toFixed(precision).replace(/^0\./, '.');
  }

  if (value === undefined) {
    return '--';
  }

  if (numeric && unit === 'plusMinus') {
    return Number(value) > 0 ? `+${value}` : value;
  }

  return value;
};

export const formatStatValue = (stat: string, value: number): string | number => {
  switch (stat) {
    case 'powerPlayPctg':
    case 'faceoffWinningPctg':
    case 'ppPctg':
    case 'pkPctg':
      return `${(value * 100).toFixed(1)}%`;
    default:
      return value;
  }
};

export const formatSecondsToGameTime = (stat: number | string | undefined): string => {
  if (stat === undefined) {
    return '--';
  }

  if (typeof stat === 'string' && stat.includes(':')) {
    return stat;
  }

  const numeric = typeof stat === 'number' ? stat : Number(stat);
  if (Number.isNaN(numeric)) {
    return '--';
  }
  const minutes = Math.floor(numeric / 60);
  const seconds = Math.round(numeric % 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatSeason = (season: string | number | undefined): string => {
  if (!season) {
    return '';
  }

  const seasonString = season.toString();

  const startYear = seasonString.slice(0, 4);
  const endYear = seasonString.slice(6, 8);

  return `${startYear}-${endYear}`;
};

export const formatOrdinalNumber = (number: number | undefined): string => {
  if (number === undefined) {
    return '';
  }

  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = number % 100;

  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

export const formatTextColorByBackgroundColor = (backgroundColor: string | undefined): string => {
  if (!backgroundColor) {
    return '#fff';
  }

  const hexColor = backgroundColor.replace('#', '');
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 125 ? '#000' : '#FFF';
};

export const formatPeriodLabel = (periodData: any, long: boolean = false): string => {
  const { number, periodType, otPeriods } = periodData;

  const ordinalSuffix = (n: number): string => {
    if (n === 1) {
      return 'st';
    }
    if (n === 2) {
      return 'nd';
    }
    if (n === 3) {
      return 'rd';
    }

    return 'th';
  };

  switch (true) {
    case number === 1:
      return long ? `1${ordinalSuffix(number)} Period` : `1${ordinalSuffix(number)}`;
    case number === 2:
      return long ? `2${ordinalSuffix(number)} Period` : `2${ordinalSuffix(number)}`;
    case number === 3 && number <= periodData.maxRegulationPeriods:
      return long ? `3${ordinalSuffix(number)} Period` : `3${ordinalSuffix(number)}`;
    case number === 4 && !otPeriods:
      return long ? 'Overtime' : 'OT';
    case number > periodData.maxRegulationPeriods && periodType === 'SO':
      return long ? 'Shootout' : 'SO';
    case number > periodData.maxRegulationPeriods && periodType === 'OT':
      return long ? `${number - 3}${ordinalSuffix(number - 3)} Overtime` : `${number - 3}OT`;
    default:
      return '';
  }
};

export const formatMarkdownContent = (content: string | undefined | null): string => {
  if (!content) {
    return '';
  }

  const parsed = marked.parse(content);
  const html = typeof parsed === 'string' ? parsed : String(parsed);

  return html
    .replace(
      /<forge-entity\s+title="([^"]+)"\s+slug="([^"]+)"\s+code="([^"]+)">([^<]+)<\/forge-entity>/g,
      '<a href="/$3/$2">$4</a>'
    )
    .replace(/https:\/\/www\.nhl\.com\//g, '/')
    .replace(/<p>/g, '<p class="mb-4">')
    .replace(/<a\s/g, '<a class="underline" ')
    .replace(/<h2>/g, '<h2 class="text-xl font-bold mb-4">')
    .replace(/<h3>/g, '<h3 class="text-lg font-bold mb-4">');
};

export const formatHeadTitle = (value: string | undefined): void => {
  if (value) {
    window.document.title = value;
  }
};

export const formatPlayerName = (name?: PlayerName): string => {
  if (!name) {
    return '(Unnamed)';
  }

  if (name.default) {
    return name.default;
  }

  if (name.firstName?.default && name.lastName?.default) {
    return `${name.firstName.default} ${name.lastName.default}`;
  }

  return '';
};

export const formatShootoutPlayer = (name?: PlayerName, teamAbbrev?: string) => {
  if (!name || !name.firstName || !name.lastName) {
    return `${teamAbbrev ?? 'Unnamed'} Shooter`;
  }

  return `${name.firstName?.default} ${name.lastName?.default}`;
};

// Maps IOC/NHL 3-letter country codes to ISO 3166-1 alpha-2 for flag emoji conversion
const COUNTRY_CODE_MAP_ISO: Record<string, string> = {
  // ISO 3166-1 alpha-3 codes (used by NHL API)
  AFG: 'AF',
  AGO: 'AO',
  ALB: 'AL',
  AND: 'AD',
  ARE: 'AE',
  ARG: 'AR',
  ARM: 'AM',
  ATG: 'AG',
  AUS: 'AU',
  AUT: 'AT',
  AZE: 'AZ',
  BDI: 'BI',
  BEL: 'BE',
  BEN: 'BJ',
  BFA: 'BF',
  BGD: 'BD',
  BGR: 'BG',
  BHR: 'BH',
  BHS: 'BS',
  BIH: 'BA',
  BLR: 'BY',
  BLZ: 'BZ',
  BOL: 'BO',
  BRA: 'BR',
  BRB: 'BB',
  BRN: 'BN',
  BTN: 'BT',
  BWA: 'BW',
  CAF: 'CF',
  CAN: 'CA',
  CHE: 'CH',
  CHL: 'CL',
  CHN: 'CN',
  CIV: 'CI',
  CMR: 'CM',
  COD: 'CD',
  COG: 'CG',
  COK: 'CK',
  COL: 'CO',
  COM: 'KM',
  CPV: 'CV',
  CRI: 'CR',
  CUB: 'CU',
  CYP: 'CY',
  CZE: 'CZ',
  DEU: 'DE',
  DJI: 'DJ',
  DNK: 'DK',
  DOM: 'DO',
  DZA: 'DZ',
  ECU: 'EC',
  EGY: 'EG',
  ERI: 'ER',
  ESP: 'ES',
  EST: 'EE',
  ETH: 'ET',
  FIN: 'FI',
  FJI: 'FJ',
  FRA: 'FR',
  FSM: 'FM',
  GAB: 'GA',
  GBR: 'GB',
  GEO: 'GE',
  GHA: 'GH',
  GIN: 'GN',
  GMB: 'GM',
  GNB: 'GW',
  GNQ: 'GQ',
  GRC: 'GR',
  GRD: 'GD',
  GTM: 'GT',
  GUY: 'GY',
  HND: 'HN',
  HRV: 'HR',
  HTI: 'HT',
  HUN: 'HU',
  IDN: 'ID',
  IND: 'IN',
  IRL: 'IE',
  IRN: 'IR',
  IRQ: 'IQ',
  ISL: 'IS',
  ISR: 'IL',
  ITA: 'IT',
  JAM: 'JM',
  JOR: 'JO',
  JPN: 'JP',
  KAZ: 'KZ',
  KEN: 'KE',
  KGZ: 'KG',
  KHM: 'KH',
  KIR: 'KI',
  KNA: 'KN',
  KOR: 'KR',
  LAO: 'LA',
  LBN: 'LB',
  LBR: 'LR',
  LBY: 'LY',
  LCA: 'LC',
  LIE: 'LI',
  LKA: 'LK',
  LSO: 'LS',
  LTU: 'LT',
  LUX: 'LU',
  LVA: 'LV',
  MAC: 'MO',
  MAR: 'MA',
  MCO: 'MC',
  MDA: 'MD',
  MDG: 'MG',
  MDV: 'MV',
  MEX: 'MX',
  MKD: 'MK',
  MLI: 'ML',
  MLT: 'MT',
  MMR: 'MM',
  MNE: 'ME',
  MNG: 'MN',
  MOZ: 'MZ',
  MRT: 'MR',
  MUS: 'MU',
  MWI: 'MW',
  MYS: 'MY',
  NAM: 'NA',
  NER: 'NE',
  NGA: 'NG',
  NIC: 'NI',
  NLD: 'NL',
  NOR: 'NO',
  NPL: 'NP',
  NRU: 'NR',
  NZL: 'NZ',
  OMN: 'OM',
  PAK: 'PK',
  PAN: 'PA',
  PER: 'PE',
  PHL: 'PH',
  PLW: 'PW',
  PNG: 'PG',
  POL: 'PL',
  PRK: 'KP',
  PRT: 'PT',
  PRY: 'PY',
  PSE: 'PS',
  PYF: 'PF',
  QAT: 'QA',
  ROU: 'RO',
  RUS: 'RU',
  RWA: 'RW',
  SAU: 'SA',
  SDN: 'SD',
  SEN: 'SN',
  SGP: 'SG',
  SLB: 'SB',
  SLE: 'SL',
  SLV: 'SV',
  SMR: 'SM',
  SOM: 'SO',
  SRB: 'RS',
  SSD: 'SS',
  STP: 'ST',
  SUR: 'SR',
  SVK: 'SK',
  SVN: 'SI',
  SWE: 'SE',
  SWZ: 'SZ',
  SYR: 'SY',
  TCD: 'TD',
  TGO: 'TG',
  THA: 'TH',
  TJK: 'TJ',
  TKM: 'TM',
  TLS: 'TL',
  TON: 'TO',
  TTO: 'TT',
  TUN: 'TN',
  TUR: 'TR',
  TWN: 'TW',
  TZA: 'TZ',
  UGA: 'UG',
  UKR: 'UA',
  URY: 'UY',
  USA: 'US',
  UZB: 'UZ',
  VCT: 'VC',
  VEN: 'VE',
  VGB: 'VG',
  VIR: 'VI',
  VNM: 'VN',
  VUT: 'VU',
  WSM: 'WS',
  YEM: 'YE',
  ZAF: 'ZA',
  ZMB: 'ZM',
  ZWE: 'ZW',
};

const COUNTRY_CODE_MAP_IOC: Record<string, string> = {
  // IOC 3-letter codes (alternate codes sometimes used)
  ALG: 'DZ',
  ANG: 'AO',
  ANT: 'AG',
  ARU: 'AW',
  BAH: 'BS',
  BAN: 'BD',
  BAR: 'BB',
  BER: 'BM',
  BHU: 'BT',
  BIZ: 'BZ',
  BOT: 'BW',
  BUL: 'BG',
  BUR: 'BF',
  CAM: 'KH',
  CAY: 'KY',
  CHA: 'TD',
  CHI: 'CL',
  CRO: 'HR',
  DEN: 'DK',
  ESA: 'SV',
  FIJ: 'FJ',
  GAM: 'GM',
  GBS: 'GW',
  GEQ: 'GQ',
  GER: 'DE',
  GRE: 'GR',
  GRN: 'GD',
  GUA: 'GT',
  GUI: 'GN',
  GUY: 'GY',
  HAI: 'HT',
  HKG: 'HK',
  HON: 'HN',
  INA: 'ID',
  IRI: 'IR',
  ISV: 'VI',
  IVB: 'VG',
  KSA: 'SA',
  KUW: 'KW',
  LAT: 'LV',
  LBA: 'LY',
  LES: 'LS',
  MAD: 'MG',
  MAS: 'MY',
  MAW: 'MW',
  MGL: 'MN',
  MRI: 'MU',
  MTN: 'MR',
  MYA: 'MM',
  NCA: 'NI',
  NED: 'NL',
  NGR: 'NG',
  OMA: 'OM',
  PAK: 'PK',
  PAR: 'PY',
  PHI: 'PH',
  PLE: 'PS',
  POR: 'PT',
  PUR: 'PR',
  RSA: 'ZA',
  SAM: 'WS',
  SEY: 'SC',
  SGP: 'SG',
  SKN: 'KN',
  SLO: 'SI',
  SOL: 'SB',
  SRI: 'LK',
  SUD: 'SD',
  SUI: 'CH',
  SUR: 'SR',
  SWZ: 'SZ',
  TAN: 'TZ',
  TGA: 'TO',
  TPE: 'TW',
  UAE: 'AE',
  URU: 'UY',
  VAN: 'VU',
  VIE: 'VN',
  VIN: 'VC',
  ZAM: 'ZM',
  ZIM: 'ZW',
};

const COUNTRY_CODE_MAP: Record<string, string> = {
  ...COUNTRY_CODE_MAP_ISO,
  ...COUNTRY_CODE_MAP_IOC,
};

/**
 * Converts a 2- or 3-letter country code to a flag emoji.
 * Returns the code unchanged if no mapping is found.
 */
export const countryCodeToFlag = (code: string | undefined): string => {
  if (!code) {
    return '';
  }
  const alpha2 =
    code.length === 3 ? (COUNTRY_CODE_MAP[code.toUpperCase()] ?? '') : code.toUpperCase();
  if (alpha2.length !== 2) {
    return code;
  }

  return Array.from(alpha2)
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
};
