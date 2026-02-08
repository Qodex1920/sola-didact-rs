import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AppMode, type GeneratedAsset, type ImageSize, type AspectRatio, type VisualContext, type ProductCategory, type ProductAnalysis, type VideoQuality } from '@/types';
import {
  analyzeProduct,
  analyzeImage,
  editImageContext,
  generateHighResImage,
  generateProductVideo,
} from '@/services/geminiService';
import { addToHistory, createThumbnail } from '@/lib/storage';

export function useGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState<GeneratedAsset | null>(null);
  const [analysisText, setAnalysisText] = useState('');
  const [productAnalysis, setProductAnalysis] = useState<ProductAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const autoAnalyze = useCallback(async (base64Image: string) => {
    setIsAnalyzing(true);
    setProductAnalysis(null);
    setAnalysisText('');
    try {
      const cleanBase64 = base64Image.split(',')[1];
      const analysis = await analyzeProduct(cleanBase64);
      setProductAnalysis(analysis);
      setAnalysisText(analysis.raw_description);
      toast.success('Produit analyse');
      return analysis;
    } catch (error: any) {
      console.error('Auto-analysis failed:', error);
      toast.error('Analyse automatique echouee');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleAction = useCallback(
    async (params: {
      appMode: AppMode;
      uploadedImage: string | null;
      selectedContext: VisualContext;
      category: ProductCategory;
      aspectRatio: AspectRatio;
      proSize: ImageSize;
      customContext?: string;
      currentAnalysis?: ProductAnalysis | null;
      productDescription?: string;
      overlayText?: string;
      videoQuality?: VideoQuality;
    }) => {
      const { appMode, uploadedImage, selectedContext, category, aspectRatio, proSize, customContext, currentAnalysis, productDescription, overlayText, videoQuality } = params;
      const analysis = currentAnalysis ?? productAnalysis;

      setResult(null);
      setIsLoading(true);

      try {
        const cleanBase64 = uploadedImage ? uploadedImage.split(',')[1] : '';

        switch (appMode) {
          case AppMode.ANALYZE: {
            if (!cleanBase64) throw new Error('Veuillez uploader une image.');
            setLoadingMessage('Analyse detaillee du produit...');
            const result = await analyzeProduct(cleanBase64);
            setProductAnalysis(result);
            setAnalysisText(result.raw_description);
            toast.success('Analyse terminee');
            break;
          }

          case AppMode.EDIT: {
            if (!cleanBase64) throw new Error('Veuillez uploader une image.');
            setLoadingMessage('Recontextualisation en cours...');
            const editedUrl = await editImageContext(
              cleanBase64, selectedContext.promptModifier, aspectRatio,
              selectedContext, category, analysis, customContext, productDescription, overlayText
            );
            const asset: GeneratedAsset = { type: 'image', url: editedUrl };
            setResult(asset);
            toast.success('Image generee avec succes');

            const thumbnail = await createThumbnail(editedUrl);
            addToHistory({
              id: crypto.randomUUID(),
              createdAt: Date.now(),
              mode: appMode,
              category,
              contextLabel: customContext || selectedContext.label,
              aspectRatio,
              asset,
              thumbnail,
            });
            break;
          }

          case AppMode.GENERATE: {
            setLoadingMessage('Generation Haute Definition (Pro Image)...');
            const genUrl = await generateHighResImage(
              selectedContext.promptModifier, proSize, aspectRatio,
              selectedContext, category, analysis,
              cleanBase64 || undefined, customContext, productDescription, overlayText
            );
            const asset: GeneratedAsset = { type: 'image', url: genUrl };
            setResult(asset);
            toast.success('Image generee avec succes');

            const thumbnail = await createThumbnail(genUrl);
            addToHistory({
              id: crypto.randomUUID(),
              createdAt: Date.now(),
              mode: appMode,
              category,
              contextLabel: customContext || selectedContext.label,
              aspectRatio,
              asset,
              thumbnail,
            });
            break;
          }

          case AppMode.VIDEO: {
            if (!cleanBase64) throw new Error('Veuillez uploader une image.');
            setLoadingMessage('Generation video avec Veo (>1min)...');
            const videoAspect = aspectRatio === '1:1' || aspectRatio === '4:5' ? '16:9' : aspectRatio;
            const videoUrl = await generateProductVideo(
              cleanBase64, selectedContext.promptModifier, videoAspect as '16:9' | '9:16',
              selectedContext, category, analysis, customContext, productDescription, overlayText, videoQuality
            );
            const asset: GeneratedAsset = { type: 'video', url: videoUrl };
            setResult(asset);
            toast.success('Video generee avec succes');

            addToHistory({
              id: crypto.randomUUID(),
              createdAt: Date.now(),
              mode: appMode,
              category,
              contextLabel: customContext || selectedContext.label,
              aspectRatio: videoAspect as AspectRatio,
              asset,
              thumbnail: '',
            });
            break;
          }
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || 'Une erreur inconnue est survenue');
      } finally {
        setIsLoading(false);
      }
    },
    [productAnalysis]
  );

  return {
    isLoading,
    loadingMessage,
    result,
    analysisText,
    productAnalysis,
    isAnalyzing,
    setResult,
    setAnalysisText,
    setProductAnalysis,
    handleAction,
    autoAnalyze,
  };
}
