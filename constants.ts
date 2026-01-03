
import { Direction } from './types';

export const DIRECTIONS = Object.values(Direction);

export const RASI_LIST = [
  'Mesham', 'Rishabham', 'Midhunam', 'Kadagam', 
  'Simmam', 'Kanni', 'Thulaam', 'Viruchigam', 
  'Dhanusu', 'Magaram', 'Kumbam', 'Meenam'
];

export const STAR_LIST = [
  'Ashwini', 'Bharani', 'Krithika', 'Rohini', 'Mrigashira', 'Arudra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Poorva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Moola', 'Poorvashadha', 'Uttarashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Poorvabhadra', 'Uttarabhadra', 'Revati'
];

export const AYADI_NATCHATHIRAM_MAP = STAR_LIST;

export const AYADI_THITHI_MAP = [
  'Pradamai', 'Dwitiyai', 'Thritiyai', 'Chathurthi', 'Panchami', 'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dasami',
  'Ekadasi', 'Dwadasi', 'Thrayodasi', 'Chathurdasi', 'Pournami', 'Amavasai'
];

export const AYADI_YONI_MAP = [
  'Garuda (East)', 'Dhuma (South East)', 'Simha (South)', 'Svana (South West)', 
  'Vrishaba (West)', 'Khara (North West)', 'Gaja (North)', 'Kaka (North East)'
];

export const AYADI_KARPAM_MAP = [
  'Siddha (Auspicious)', 'Sadhya (Good)', 'Susidha (Very Good)', 'Ari (Inauspicious)'
];

export const AYADI_AMSAM_MAP = [
  'Thidha', 'Laba', 'Hani', 'Kethu', 'Sowmya', 'Chora', 'Subha', 'Asubha', 'Misra'
];

export const AYADI_VAMSAM_MAP = [
  'Brahmana', 'Kshatriya', 'Vaishya', 'Shudra'
];

export const AYADI_NETHIRAM_MAP = [
  'Open (2 Eyes)', 'Partial (1 Eye)', 'Closed (No Eyes)'
];

export const AYADI_SOOTHIRAM_MAP = [
  'Brahma', 'Vishnu', 'Shiva', 'Indra'
];

export const AYADI_YOGAM_MAP = [
  'Siddha', 'Amirtha', 'Marana', 'Prabalarishta', 'Shubha'
];

export const AYADI_PANJAGAM_MAP = [
  'Roga', 'Mara', 'Raja', 'Chora', 'Subha'
];

export const AYADI_VAARAM_MAP = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];
