import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { AppMode, ProductCategory, VisualContext, ImageSize, GeneratedAsset } from './types';
import { GAME_CONTEXTS, FURNITURE_CONTEXTS } from './constants';
import { analyzeImage, editImageContext, generateHighResImage, generateProductVideo } from './services/geminiService';

export default function App() {
  const [category, setCategory] = useState<ProductCategory>(ProductCategory.GAME);
  const [selectedContext, setSelectedContext] = useState<VisualContext>(GAME_CONTEXTS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [appMode, setAppMode] = useState<AppMode>(AppMode.EDIT);
  
  // Generation State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState<GeneratedAsset | null>(null);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [proSize, setProSize] = useState<ImageSize>('1K');

  const contexts = category === ProductCategory.GAME ? GAME_CONTEXTS : FURNITURE_CONTEXTS;

  const handleCategoryChange = (cat: ProductCategory) => {
    setCategory(cat);
    // Reset context to first of new category
    setSelectedContext(cat === ProductCategory.GAME ? GAME_CONTEXTS[0] : FURNITURE_CONTEXTS[0]);
  };

  const handleAction = async () => {
    setResult(null);
    setAnalysisText('');
    setIsLoading(true);

    try {
      // Clean base64 for API (remove data:image... prefix)
      const cleanBase64 = uploadedImage ? uploadedImage.split(',')[1] : '';

      switch (appMode) {
        case AppMode.ANALYZE:
            if (!cleanBase64) throw new Error("Veuillez uploader une image.");
            setLoadingMessage("Analyse du produit avec Gemini Pro...");
            const text = await analyzeImage(cleanBase64);
            setAnalysisText(text);
            break;

        case AppMode.EDIT:
            if (!cleanBase64) throw new Error("Veuillez uploader une image.");
            setLoadingMessage("Recontextualisation avec Nano Banana...");
            const editedUrl = await editImageContext(cleanBase64, selectedContext.promptModifier);
            setResult({ type: 'image', url: editedUrl });
            break;

        case AppMode.GENERATE:
            // This mode doesn't strictly require an upload if we trust the context prompt, 
            // but usually we want to base it on something. 
            // For Sola Didact, let's assume we are generating purely from prompt + context 
            // OR refining the prompt based on analysis? 
            // The prompt says "Generate images...". 
            setLoadingMessage("Génération Haute Définition (Pro Image)...");
            // If user has uploaded an image, we might want to describe it first, but for now let's use the context prompt.
            // A truly robust app might analyze the uploaded image to get a description, then feed that into the generator.
            // Let's assume we use the context prompt modifier directly.
            const genUrl = await generateHighResImage(selectedContext.promptModifier, proSize);
            setResult({ type: 'image', url: genUrl });
            break;

        case AppMode.VIDEO:
            if (!cleanBase64) throw new Error("Veuillez uploader une image.");
            setLoadingMessage("Génération vidéo avec Veo (cela peut prendre >1min)...");
            const videoUrl = await generateProductVideo(cleanBase64, selectedContext.promptModifier, '16:9');
            setResult({ type: 'video', url: videoUrl });
            break;
      }
    } catch (error: any) {
      console.error(error);
      alert(`Erreur: ${error.message || "Une erreur inconnue est survenue"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-sola-text pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 1. Category Selector */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                1. Type de Produit
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleCategoryChange(ProductCategory.GAME)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    category === ProductCategory.GAME
                      ? 'bg-sola-brick text-white border-sola-brick'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-sola-brick'
                  }`}
                >
                  🧩 Jeux Éducatifs
                </button>
                <button
                  onClick={() => handleCategoryChange(ProductCategory.FURNITURE)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    category === ProductCategory.FURNITURE
                      ? 'bg-sola-brick text-white border-sola-brick'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-sola-brick'
                  }`}
                >
                  🪑 Mobilier
                </button>
              </div>
            </div>

            {/* 2. Upload */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">2. Image Source</h2>
              <ImageUploader 
                currentImage={uploadedImage} 
                onImageSelected={setUploadedImage} 
              />
              {uploadedImage && (
                 <div className="mt-4 flex gap-2">
                    <button 
                        onClick={() => { setAppMode(AppMode.ANALYZE); handleAction(); }}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-1 w-full justify-center"
                    >
                        🔍 Analyser le produit
                    </button>
                 </div>
              )}
              {analysisText && (
                  <div className="mt-4 p-3 bg-blue-50 text-blue-900 text-xs rounded-lg border border-blue-100 leading-relaxed">
                      <strong>Analyse IA:</strong> {analysisText}
                  </div>
              )}
            </div>

            {/* 3. Mode & Execute */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4">3. Action</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                        type="radio" 
                        name="mode" 
                        checked={appMode === AppMode.EDIT}
                        onChange={() => setAppMode(AppMode.EDIT)}
                        className="text-sola-brick focus:ring-sola-brick"
                    />
                    <div>
                        <span className="block font-medium text-gray-900">Mise en situation (Standard)</span>
                        <span className="block text-xs text-gray-500">Nano Banana - Rapide</span>
                    </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                        type="radio" 
                        name="mode" 
                        checked={appMode === AppMode.VIDEO}
                        onChange={() => setAppMode(AppMode.VIDEO)}
                        className="text-sola-brick focus:ring-sola-brick"
                    />
                    <div>
                        <span className="block font-medium text-gray-900">Générer une Vidéo</span>
                        <span className="block text-xs text-gray-500">Veo - Animation lente</span>
                    </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                        type="radio" 
                        name="mode" 
                        checked={appMode === AppMode.GENERATE}
                        onChange={() => setAppMode(AppMode.GENERATE)}
                        className="text-sola-brick focus:ring-sola-brick"
                    />
                    <div>
                        <span className="block font-medium text-gray-900">Génération Créative (Pro)</span>
                        <span className="block text-xs text-gray-500">Création pure (sans image source stricte)</span>
                    </div>
                </label>
              </div>

              {appMode === AppMode.GENERATE && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Résolution</label>
                      <div className="flex gap-2">
                        {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                            <button
                                key={size}
                                onClick={() => setProSize(size)}
                                className={`flex-1 py-1 text-xs rounded border ${proSize === size ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-300'}`}
                            >
                                {size}
                            </button>
                        ))}
                      </div>
                  </div>
              )}

              <button
                onClick={handleAction}
                disabled={isLoading || (!uploadedImage && appMode !== AppMode.GENERATE)}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                    isLoading || (!uploadedImage && appMode !== AppMode.GENERATE)
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-sola-brick hover:bg-red-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? 'Traitement...' : '✨ Générer'}
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Contexts & Result */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Context Grid */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Choisir le Contexte</h2>
                    <span className="text-sm bg-white px-2 py-1 rounded border text-gray-500">
                        {category === ProductCategory.GAME ? 'Jeux Éducatifs' : 'Mobilier'}
                    </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {contexts.map((ctx) => (
                        <button
                            key={ctx.id}
                            onClick={() => setSelectedContext(ctx)}
                            className={`relative group p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                                selectedContext.id === ctx.id
                                    ? 'border-sola-brick bg-white ring-1 ring-sola-brick'
                                    : 'border-transparent bg-white hover:border-gray-200'
                            }`}
                        >
                            <div className="text-3xl mb-3">{ctx.icon}</div>
                            <h3 className={`font-bold text-sm ${selectedContext.id === ctx.id ? 'text-sola-brick' : 'text-gray-800'}`}>
                                {ctx.label}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 leading-snug">
                                {ctx.description}
                            </p>
                            
                            {selectedContext.id === ctx.id && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sola-brick"></div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Result Area */}
            <section>
                <h2 className="text-xl font-bold mb-4">Aperçu</h2>
                <ResultDisplay 
                    asset={result} 
                    loading={isLoading} 
                    loadingMessage={loadingMessage}
                />
            </section>

          </div>

        </div>
      </main>
    </div>
  );
}