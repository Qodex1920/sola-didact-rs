import { useState, useCallback, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import { ControlPanel } from '@/components/ControlPanel';
import { ContextGrid } from '@/components/ContextGrid';
import { ResultDisplay } from '@/components/ResultDisplay';
import { GenerationHistory } from '@/components/GenerationHistory';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useGeneration } from '@/hooks/useGeneration';
import { AppMode, ProductCategory, EMPTY_CUSTOM_CONTEXT, serializeCustomContext, type ImageSize, type AspectRatio, type VideoQuality, type CustomContextFields } from '@/types';
import { GAME_CONTEXTS, FURNITURE_CONTEXTS } from '@/constants';

export default function App() {
  const [category, setCategory] = useState<ProductCategory>(ProductCategory.GAME);
  const [selectedContext, setSelectedContext] = useState(GAME_CONTEXTS[0]);
  const [appMode, setAppMode] = useState<AppMode>(AppMode.EDIT);
  const [proSize, setProSize] = useState<ImageSize>('1K');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [historyKey, setHistoryKey] = useState(0);
  const [customContext, setCustomContext] = useState<CustomContextFields>(EMPTY_CUSTOM_CONTEXT);
  const [useCustomContext, setUseCustomContext] = useState(false);
  const [productDescription, setProductDescription] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('fast');

  const imageUpload = useImageUpload();
  const generation = useGeneration();

  const contexts = category === ProductCategory.GAME ? GAME_CONTEXTS : FURNITURE_CONTEXTS;

  // Auto-analyze when image is uploaded
  useEffect(() => {
    if (imageUpload.uploadedImage && !generation.productAnalysis && !generation.isAnalyzing) {
      generation.autoAnalyze(imageUpload.uploadedImage);
    }
  }, [imageUpload.uploadedImage]);

  const handleCategoryChange = (cat: ProductCategory) => {
    setCategory(cat);
    setSelectedContext(cat === ProductCategory.GAME ? GAME_CONTEXTS[0] : FURNITURE_CONTEXTS[0]);
  };

  const handleImageClear = useCallback(() => {
    imageUpload.clearImage();
    generation.setProductAnalysis(null);
    generation.setAnalysisText('');
    setProductDescription('');
  }, [imageUpload, generation]);

  const handleAnalyze = useCallback(() => {
    generation.handleAction({
      appMode: AppMode.ANALYZE,
      uploadedImage: imageUpload.uploadedImage,
      selectedContext,
      category,
      aspectRatio,
      proSize,
    });
  }, [generation, imageUpload.uploadedImage, selectedContext, category, aspectRatio, proSize]);

  const handleGenerate = useCallback(() => {
    const serialized = useCustomContext ? serializeCustomContext(customContext) : '';
    const ctxCustom = serialized || undefined;
    generation
      .handleAction({
        appMode,
        uploadedImage: imageUpload.uploadedImage,
        selectedContext,
        category,
        aspectRatio,
        proSize,
        customContext: ctxCustom,
        currentAnalysis: generation.productAnalysis,
        productDescription: productDescription.trim() || undefined,
        overlayText: overlayText.trim() || undefined,
        videoQuality,
      })
      .then(() => setHistoryKey((k) => k + 1));
  }, [generation, appMode, imageUpload.uploadedImage, selectedContext, category, aspectRatio, proSize, customContext, useCustomContext, productDescription, overlayText, videoQuality]);

  const handleHistorySelect = useCallback(
    (asset: import('@/types').GeneratedAsset) => {
      generation.setResult(asset);
    },
    [generation]
  );

  return (
    <div className="min-h-screen font-sans text-sola-text pb-20">
      <Header />
      <Toaster position="bottom-right" richColors />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-4">
            <ControlPanel
              category={category}
              onCategoryChange={handleCategoryChange}
              appMode={appMode}
              onModeChange={setAppMode}
              proSize={proSize}
              onProSizeChange={setProSize}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              uploadedImage={imageUpload.uploadedImage}
              isDragging={imageUpload.isDragging}
              onFileSelect={imageUpload.handleFileSelect}
              onDrop={imageUpload.handleDrop}
              onDragOver={imageUpload.handleDragOver}
              onDragLeave={imageUpload.handleDragLeave}
              onClearImage={handleImageClear}
              onAnalyze={handleAnalyze}
              onGenerate={handleGenerate}
              isLoading={generation.isLoading}
              analysisText={generation.analysisText}
              productAnalysis={generation.productAnalysis}
              isAnalyzing={generation.isAnalyzing}
              productDescription={productDescription}
              onProductDescriptionChange={setProductDescription}
              overlayText={overlayText}
              onOverlayTextChange={setOverlayText}
              videoQuality={videoQuality}
              onVideoQualityChange={setVideoQuality}
            />
          </div>

          {/* RIGHT COLUMN: Contexts & Result */}
          <div className="lg:col-span-8 space-y-8">
            <ContextGrid
              contexts={contexts}
              selectedContext={selectedContext}
              onSelect={(ctx) => { setSelectedContext(ctx); setUseCustomContext(false); }}
              category={category}
              customContext={customContext}
              useCustomContext={useCustomContext}
              onCustomContextChange={setCustomContext}
              onToggleCustomContext={setUseCustomContext}
            />

            <section>
              <h2 className="text-xl font-bold mb-4">Apercu</h2>
              <ResultDisplay
                asset={generation.result}
                loading={generation.isLoading}
                loadingMessage={generation.loadingMessage}
              />
            </section>

            <GenerationHistory onSelect={handleHistorySelect} refreshKey={historyKey} />
          </div>
        </div>
      </main>
    </div>
  );
}
