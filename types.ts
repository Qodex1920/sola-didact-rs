export enum ProductCategory {
  GAME = 'GAME',
  FURNITURE = 'FURNITURE'
}

export interface VisualContext {
  id: string;
  label: string;
  description: string;
  promptModifier: string;
  icon: string;
}

export enum AppMode {
  EDIT = 'EDIT', // Use existing image + context
  GENERATE = 'GENERATE', // Generate fresh image (Pro)
  VIDEO = 'VIDEO', // Animate existing image
  ANALYZE = 'ANALYZE' // Describe image
}

export interface GeneratedAsset {
  type: 'image' | 'video';
  url: string;
  mimeType?: string;
}

export type ImageSize = '1K' | '2K' | '4K';