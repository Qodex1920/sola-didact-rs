import { GoogleGenAI, Type } from "@google/genai";
import { SOLA_IDENTITY_PROMPT } from "../constants";

// Helper to ensure we have a key for paid services
async function ensureApiKeySelection() {
  // Use type assertion to avoid conflicts with existing global type definitions
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
    }
  }
}

// Helper: Initialize Client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not found in environment");
  return new GoogleGenAI({ apiKey });
};

// 1. ANALYZE IMAGE (Gemini 3 Pro)
export const analyzeImage = async (base64Image: string): Promise<string> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: "Analyze this image in detail. Identify if it is an educational game or furniture. Describe its materials, colors, and key features. Provide a concise summary suitable for a marketing description."
        }
      ]
    }
  });

  return response.text || "No analysis available.";
};

// 2. EDIT IMAGE / RECONTEXTUALIZE (Gemini 2.5 Flash Image)
// This is used for the "Nano Banana" requirement to apply contexts to existing photos.
export const editImageContext = async (
  base64Image: string, 
  promptModifier: string
): Promise<string> => {
  const ai = getAiClient();
  const fullPrompt = `${SOLA_IDENTITY_PROMPT} \n\n Task: Transform the provided product image to fit the following context: ${promptModifier}. Ensure the product remains the focal point and unchanged in structure, but integrated into the new environment.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: fullPrompt
        }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: '1:1' // Instagram square default
      }
    }
  });

  // Extract image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated.");
};

// 3. GENERATE HIGH RES IMAGE (Gemini 3 Pro Image)
// "Nano Banana Pro"
export const generateHighResImage = async (
  promptModifier: string,
  size: '1K' | '2K' | '4K' = '1K'
): Promise<string> => {
  await ensureApiKeySelection(); // User pays for Pro
  const ai = getAiClient(); // Re-init to pick up potential new key state

  const fullPrompt = `${SOLA_IDENTITY_PROMPT} \n\n Create a photorealistic image: ${promptModifier}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: fullPrompt }]
    },
    config: {
      imageConfig: {
        imageSize: size,
        aspectRatio: '1:1'
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No high-res image generated.");
};

// 4. GENERATE VIDEO (Veo)
export const generateProductVideo = async (
  base64Image: string,
  promptModifier: string,
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> => {
  await ensureApiKeySelection(); // User pays for Veo
  const ai = getAiClient();

  const prompt = `Cinematic slow motion product video. ${promptModifier}. ${SOLA_IDENTITY_PROMPT}`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: base64Image,
      mimeType: 'image/jpeg'
    },
    config: {
      numberOfVideos: 1,
      aspectRatio: aspectRatio,
      resolution: '720p' // Fast preview default
    }
  });

  // Polling
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed.");

  // Fetch the actual bytes
  const apiKey = process.env.API_KEY;
  const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};
