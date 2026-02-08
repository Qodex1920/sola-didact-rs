export enum ProductCategory {
  GAME = 'GAME',
  FURNITURE = 'FURNITURE',
}

export interface VisualContext {
  id: string;
  label: string;
  description: string;
  promptModifier: string;
  icon: string;
}

export interface ProductAnalysis {
  product_type: string;
  name_suggestion: string;
  materials: string;
  colors: string;
  dimensions_estimate: string;
  shape: string;
  key_features: string;
  texture: string;
  components: string;
  age_group: string;
  raw_description: string;
}

export enum AppMode {
  EDIT = 'EDIT',
  GENERATE = 'GENERATE',
  VIDEO = 'VIDEO',
  ANALYZE = 'ANALYZE',
}

export interface GeneratedAsset {
  type: 'image' | 'video';
  url: string;
  mimeType?: string;
}

export type ImageSize = '1K' | '2K' | '4K';

export type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16';

export type VideoQuality = 'fast' | 'pro';

export interface CustomContextFields {
  environment: string;
  surface: string;
  lighting: string;
  mood: string;
  props: string;
  extra: string;
}

export const EMPTY_CUSTOM_CONTEXT: CustomContextFields = {
  environment: '',
  surface: '',
  lighting: '',
  mood: '',
  props: '',
  extra: '',
};

export function serializeCustomContext(fields: CustomContextFields): string {
  const parts: string[] = [];
  if (fields.environment.trim()) parts.push(`Environment: ${fields.environment.trim()}`);
  if (fields.surface.trim()) parts.push(`Surface/support: ${fields.surface.trim()}`);
  if (fields.lighting.trim()) parts.push(`Lighting: ${fields.lighting.trim()}`);
  if (fields.mood.trim()) parts.push(`Mood/atmosphere: ${fields.mood.trim()}`);
  if (fields.props.trim()) parts.push(`Surrounding elements: ${fields.props.trim()}`);
  if (fields.extra.trim()) parts.push(fields.extra.trim());
  return parts.join('. ');
}

export interface HistoryEntry {
  id: string;
  createdAt: number;
  mode: AppMode;
  category: ProductCategory;
  contextLabel: string;
  aspectRatio: AspectRatio;
  asset: GeneratedAsset;
  thumbnail: string;
}
