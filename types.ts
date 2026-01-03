
export enum Direction {
  NORTH = 'North',
  SOUTH = 'South',
  EAST = 'East',
  WEST = 'West',
  NORTH_EAST = 'North East',
  NORTH_WEST = 'North West',
  SOUTH_EAST = 'South East',
  SOUTH_WEST = 'South West'
}

export interface LandInfo {
  length: number;
  width: number;
  totalSqFt: number;
  totalKuzhi: number;
  facing: Direction;
  roadDirection: Direction;
}

export interface OwnerInfo {
  name: string;
  age: string;
  dob: string;
  tob: string;
  star: string;
  rasi: string;
}

export interface AyadiParameters {
  karpam: string;
  varavu: number;
  selavu: number;
  aayul: number;
  natchathiram: string;
  thithi: string;
  yoni: string;
  amsam: string;
  vamsam: string;
  nethiram: string;
  soothiram: string;
  yogam: string;
  vaaram: string;
  panjagam: string;
}

export interface RoomRequirements {
  bedroomCount: number;
  bedroomSize: string;
  bedroomHasAttachedBath: boolean;
  kitchenSize: string;
  poojaSize: string;
  readingRoomSize: string;
  porticoSize: string;
  toiletSize: string;
  floors: number;
  borewellDirection: Direction;
  overheadTankDirection: Direction;
  mainEntrance: Direction;
}

export interface CalculationResult {
  ayadi: AyadiParameters;
  isVaravuGreater: boolean;
  isAayulAuspicious: boolean;
  status: 'Auspicious' | 'Average' | 'Inauspicious';
}
