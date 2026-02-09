import { GoogleGenAI } from '@google/genai';
import type { AspectRatio, ImageSize, ProductCategory, VisualContext, ProductAnalysis, VideoQuality } from '@/types';
import {
  buildAnalyzePrompt,
  buildEditPrompt,
  buildGeneratePrompt,
  buildVideoPrompt,
} from './promptBuilder';

async function ensureApiKeySelection() {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
    }
  }
}

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error('API_KEY not found in environment');
  return new GoogleGenAI({ apiKey });
};

// 1. ANALYZE PRODUCT - Returns structured ProductAnalysis
export const analyzeProduct = async (base64Image: string): Promise<ProductAnalysis> => {
  const ai = getAiClient();
  const prompt = buildAnalyzePrompt();

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt },
      ],
    },
  });

  const text = response.text || '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Normalize all fields to strings — Gemini sometimes returns objects/arrays
      const normalized: Record<string, string> = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'string') {
          normalized[key] = value;
        } else if (Array.isArray(value)) {
          normalized[key] = value
            .map((v) => (typeof v === 'object' && v !== null ? Object.values(v).join(' ') : String(v)))
            .join(', ');
        } else if (typeof value === 'object' && value !== null) {
          normalized[key] = Object.values(value).join(' ');
        } else {
          normalized[key] = String(value ?? '');
        }
      }
      return { ...normalized, raw_description: text } as ProductAnalysis;
    }
  } catch {
    // Fallback
  }

  return {
    product_type: 'unknown',
    name_suggestion: 'Product',
    materials: text,
    colors: '',
    dimensions_estimate: '',
    shape: '',
    key_features: text,
    texture: '',
    components: '',
    age_group: '',
    raw_description: text,
  };
};

// Legacy wrapper for backward compat with useGeneration hook
export const analyzeImage = async (base64Image: string): Promise<string> => {
  const analysis = await analyzeProduct(base64Image);
  return analysis.raw_description;
};

// 2. EDIT IMAGE / RECONTEXTUALIZE (Nano Banana)
export const editImageContext = async (
  base64Image: string,
  promptModifier: string,
  aspectRatio: AspectRatio = '1:1',
  context?: VisualContext,
  category?: ProductCategory,
  productAnalysis?: ProductAnalysis | null,
  customContext?: string,
  productDescription?: string,
  overlayText?: string,
  additionalImages?: string[]
): Promise<string> => {
  const ai = getAiClient();
  const multiProduct = (additionalImages?.length ?? 0) > 0;

  const fullPrompt = context && category
    ? buildEditPrompt(context, category, productAnalysis ?? null, customContext, productDescription, overlayText, multiProduct)
    : `Place this exact product into the following scene: ${promptModifier}. The product must remain identical - same shape, colors, materials, proportions. Integrate natural shadows and reflections consistent with the scene lighting.`;

  const parts: any[] = [
    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
  ];
  if (additionalImages) {
    for (const img of additionalImages) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: img } });
    }
  }
  parts.push({ text: fullPrompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error('No image generated.');
};

// 3. GENERATE HIGH RES IMAGE (Nano Banana Pro)
export const generateHighResImage = async (
  promptModifier: string,
  size: ImageSize = '1K',
  aspectRatio: AspectRatio = '1:1',
  context?: VisualContext,
  category?: ProductCategory,
  productAnalysis?: ProductAnalysis | null,
  base64Image?: string,
  customContext?: string,
  productDescription?: string,
  overlayText?: string,
  additionalImages?: string[]
): Promise<string> => {
  await ensureApiKeySelection();
  const ai = getAiClient();
  const multiProduct = (additionalImages?.length ?? 0) > 0;

  const fullPrompt = context && category
    ? buildGeneratePrompt(context, category, productAnalysis ?? null, customContext, productDescription, overlayText, multiProduct)
    : `Create a photorealistic image: ${promptModifier}`;

  const parts: any[] = [];
  if (base64Image) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Image } });
  }
  if (additionalImages) {
    for (const img of additionalImages) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: img } });
    }
  }
  parts.push({ text: fullPrompt });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts },
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio,
        imageSize: size,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error('No high-res image generated.');
};

// Pre-crop an image to match the target aspect ratio (center crop)
async function cropImageToAspectRatio(
  base64Image: string,
  targetRatio: '16:9' | '9:16'
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const [rw, rh] = targetRatio === '16:9' ? [16, 9] : [9, 16];
      const targetAspect = rw / rh;
      const srcAspect = img.width / img.height;

      let sx = 0, sy = 0, sw = img.width, sh = img.height;

      if (srcAspect > targetAspect) {
        // Source is wider than target: crop horizontally
        sw = img.height * targetAspect;
        sx = (img.width - sw) / 2;
      } else {
        // Source is taller than target: crop vertically
        sh = img.width / targetAspect;
        sy = (img.height - sh) / 2;
      }

      // Target at least 720p on the shortest side
      const scale = Math.max(720 / Math.min(sw, sh), 1);
      canvas.width = Math.round(sw * scale);
      canvas.height = Math.round(sh * scale);

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

      // Return raw base64 (no data: prefix)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(dataUrl.split(',')[1]);
    };
    img.onerror = () => resolve(base64Image);
    img.src = `data:image/jpeg;base64,${base64Image}`;
  });
}

// 4. GENERATE VIDEO (Veo)
export const generateProductVideo = async (
  base64Image: string,
  promptModifier: string,
  aspectRatio: '16:9' | '9:16' = '16:9',
  context?: VisualContext,
  category?: ProductCategory,
  productAnalysis?: ProductAnalysis | null,
  customContext?: string,
  productDescription?: string,
  overlayText?: string,
  videoQuality: VideoQuality = 'fast',
  additionalImages?: string[],
  durationSeconds?: number
): Promise<string> => {
  await ensureApiKeySelection();
  const ai = getAiClient();
  const multiProduct = (additionalImages?.length ?? 0) > 0;

  const prompt = context && category
    ? buildVideoPrompt(context, category, productAnalysis ?? null, customContext, productDescription, overlayText, multiProduct)
    : `Cinematic slow motion product video. ${promptModifier}.`;

  const videoModel = videoQuality === 'pro' ? 'veo-3.1-generate-preview' : 'veo-3.1-fast-generate-preview';

  // Pre-crop input image to match target aspect ratio (Veo works better this way)
  const croppedImage = await cropImageToAspectRatio(base64Image, aspectRatio);

  const videoConfig: any = {
    numberOfVideos: 1,
    aspectRatio,
    resolution: '720p',
  };
  if (durationSeconds) {
    videoConfig.durationSeconds = durationSeconds;
  }
  if (additionalImages && additionalImages.length > 0) {
    videoConfig.referenceImages = additionalImages.map((img) => ({
      image: { imageBytes: img, mimeType: 'image/jpeg' },
      referenceType: 'ASSET',
    }));
  }

  let operation = await ai.models.generateVideos({
    model: videoModel,
    prompt,
    image: {
      imageBytes: croppedImage,
      mimeType: 'image/jpeg',
    },
    config: videoConfig,
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  // Log full response for debugging
  console.log('[Veo] Operation response:', JSON.stringify(operation, null, 2));

  if ((operation as any).error) {
    const err = (operation as any).error;
    throw new Error(`Video generation rejected: ${err.message || JSON.stringify(err)}`);
  }

  const generatedVideo = operation.response?.generatedVideos?.[0];
  const filteredReasons = (operation.response as any)?.raiMediaFilteredReasons as string[] | undefined;
  if (filteredReasons?.length) {
    const reason = filteredReasons[0];
    // User-friendly French messages for common Veo safety filters
    if (reason.toLowerCase().includes('children')) {
      throw new Error('Veo refuse les images contenant des enfants realistes. Utilise une photo du produit seul (sans personne) pour la video.');
    }
    throw new Error(`Video filtree par la securite Google: ${reason}`);
  }

  const downloadLink = generatedVideo?.video?.uri;
  if (!downloadLink) throw new Error('Generation video echouee - aucune video dans la reponse. Verifiez la console pour les details.');

  const apiKey = process.env.API_KEY;
  const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};
