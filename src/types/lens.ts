export type LensType = '定焦' | '变焦';
export type FocusType = '自动对焦 (AF)' | '手动对焦 (MF)';
export type BrandCategory = 
  | 'all'
  | 'sony'
  | 'sigma'
  | 'tamron'
  | 'zeiss'
  | 'samyang'
  | 'viltrox'
  | 'laowa'
  | 'voigtlander'
  | 'ttartisan'
  | '7artisans'
  | 'yongnuo'
  | 'other';

export type FocalCategory = 
  | 'ultra-wide'      // <=24mm
  | 'wide'            // 24-35mm
  | 'standard'        // 35-60mm
  | 'telephoto'       // 70-135mm
  | 'super-telephoto'; // >135mm

export interface Lens {
  id: string;
  index: number;
  name: string;
  brandZh: string;
  brandEn: string;
  brandCategory: BrandCategory;
  type: LensType;
  focalMin: number;
  focalMax: number;
  focalDesc: string;
  focalCategory: FocalCategory[];
  apertureDesc: string;
  maxAperture: number;
  focusType: string;
  isAF: boolean;
  ossDesc: string;
  hasOSS: boolean;
  sharpnessStar: string;
  sharpnessScore: number;
  uniformityScore: number;
  wideOpenScore: number;
  caControlScore: number;
  bokehScore: number;
  distortionScore: number;
  overallScore: number;
  portabilityScore: number;
  valueScore: number;
  releaseDate: string;
  minFocusDist: string;
  weightG: number;
  lengthMm: number;
  filterThread: string;
  priceCny: number;
  isGM: boolean;
  isG: boolean;
  isZeiss: boolean;
  isMacro: boolean;
  isPZ: boolean;
  isCine: boolean;
}

export type SortField = 
  | 'overallScore'
  | 'valueScore'
  | 'portabilityScore'
  | 'sharpnessScore'
  | 'priceCny'
  | 'weightG'
  | 'releaseDate'
  | 'focalMin'
  | 'maxAperture';

export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  brandCategory: BrandCategory;
  type: 'all' | '定焦' | '变焦';
  focusType: 'all' | 'af' | 'mf';
  hasOSS: 'all' | 'yes' | 'no';
  focalCategories: FocalCategory[];
  maxApertureMin: number;
  maxApertureMax: number;
  priceMin: number;
  priceMax: number;
  weightMin: number;
  weightMax: number;
  overallScoreMin: number;
  isMacroOnly: boolean;
  isGMOnly: boolean;
  isGOnly: boolean;
  filterThread: string; // 'all' or specific thread like '67', '72', '77', '82'
  preset: string | null;
}

export type ViewMode = 'grid' | 'table';
