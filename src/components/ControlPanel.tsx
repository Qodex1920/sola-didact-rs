import React from 'react';
import { AppMode, ProductCategory, type ImageSize, type AspectRatio, type ProductAnalysis, type VideoQuality } from '@/types';
import { ImageUploader } from './ImageUploader';
import { AspectRatioSelector } from './AspectRatioSelector';

interface ControlPanelProps {
  category: ProductCategory;
  onCategoryChange: (cat: ProductCategory) => void;
  appMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  proSize: ImageSize;
  onProSizeChange: (size: ImageSize) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  uploadedImage: string | null;
  isDragging: boolean;
  onFileSelect: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onClearImage: () => void;
  onAnalyze: () => void;
  onGenerate: () => void;
  isLoading: boolean;
  analysisText: string;
  productAnalysis: ProductAnalysis | null;
  isAnalyzing: boolean;
  productDescription: string;
  onProductDescriptionChange: (value: string) => void;
  overlayText: string;
  onOverlayTextChange: (value: string) => void;
  videoQuality: VideoQuality;
  onVideoQualityChange: (quality: VideoQuality) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  category,
  onCategoryChange,
  appMode,
  onModeChange,
  proSize,
  onProSizeChange,
  aspectRatio,
  onAspectRatioChange,
  uploadedImage,
  isDragging,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  onClearImage,
  onAnalyze,
  onGenerate,
  isLoading,
  analysisText,
  productAnalysis,
  isAnalyzing,
  productDescription,
  onProductDescriptionChange,
  overlayText,
  onOverlayTextChange,
  videoQuality,
  onVideoQualityChange,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Category Selector */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">1. Type de Produit</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: ProductCategory.GAME, label: 'Jeux Educatifs', icon: '' },
            { value: ProductCategory.FURNITURE, label: 'Mobilier', icon: '' },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                category === cat.value
                  ? 'bg-sola-primary text-white border-sola-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-sola-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Upload */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold mb-4">2. Image Source</h2>
        <ImageUploader
          currentImage={uploadedImage}
          isDragging={isDragging}
          onFileSelect={onFileSelect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClear={onClearImage}
        />

        {/* Auto-analysis status */}
        {isAnalyzing && (
          <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200 flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            Analyse automatique du produit en cours...
          </div>
        )}

        {/* Product analysis result */}
        {productAnalysis && !isAnalyzing && (
          <div className="mt-4 p-3 bg-green-50 text-green-900 text-xs rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-1">
              <strong>Produit analyse</strong>
              <span className="text-green-600 text-[10px]">Injecte dans les prompts</span>
            </div>
            <p className="leading-relaxed">
              <strong>{productAnalysis.name_suggestion}</strong> - {productAnalysis.materials}
            </p>
            {productAnalysis.colors && (
              <p className="mt-1">Couleurs: {productAnalysis.colors}</p>
            )}
            {productAnalysis.dimensions_estimate && (
              <p className="mt-1">Proportions: {productAnalysis.dimensions_estimate}</p>
            )}
          </div>
        )}

        {/* Manual analyze button (fallback) */}
        {uploadedImage && !productAnalysis && !isAnalyzing && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-1 w-full justify-center disabled:opacity-50"
            >
              Analyser le produit
            </button>
          </div>
        )}
      </div>

      {/* 2b. Product Description */}
      {uploadedImage && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-700">Description produit</h2>
            <span className="text-[10px] text-gray-400">Optionnel</span>
          </div>
          <p className="text-[11px] text-gray-400 mb-3">
            Decris les caracteristiques fonctionnelles que l'IA ne peut pas voir sur la photo (ex: pliable, mecanisme, usage specifique).
          </p>
          <textarea
            value={productDescription}
            onChange={(e) => onProductDescriptionChange(e.target.value)}
            placeholder="Ex: Tabouret pliable qui se replie comme un accordeon. Utilise en classe pour les coins lecture."
            className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none h-20 focus:border-sola-primary focus:ring-1 focus:ring-sola-primary focus:outline-none placeholder:text-gray-300"
          />
          {productDescription.trim() && (
            <p className="mt-1.5 text-[10px] text-sola-primary font-medium">
              Cette description sera injectee dans les prompts de generation
            </p>
          )}
        </div>
      )}

      {/* 2c. Overlay Text / Narration */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-700">
            {appMode === AppMode.VIDEO ? 'Narration / Voix-off' : 'Texte sur l\'image'}
          </h2>
          <span className="text-[10px] text-gray-400">Optionnel</span>
        </div>
        <p className="text-[11px] text-gray-400 mb-3">
          {appMode === AppMode.VIDEO
            ? 'Definis ce qui doit etre dit/narre dans la video (voix-off, dialogue).'
            : 'Definis le texte visible a integrer sur l\'image (titre, slogan, prix...).'}
        </p>
        <textarea
          value={overlayText}
          onChange={(e) => onOverlayTextChange(e.target.value)}
          placeholder={
            appMode === AppMode.VIDEO
              ? 'Ex: "Decouvrez notre nouveau jeu educatif, concu pour les enfants de 3 a 6 ans."'
              : 'Ex: "Nouveau" en haut a gauche, "A partir de 29 CHF" en bas'
          }
          className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none h-20 focus:border-sola-primary focus:ring-1 focus:ring-sola-primary focus:outline-none placeholder:text-gray-300"
        />
        {overlayText.trim() && (
          <p className="mt-1.5 text-[10px] text-sola-primary font-medium">
            {appMode === AppMode.VIDEO
              ? 'Ce texte sera utilise comme narration dans la video'
              : 'Ce texte sera integre visuellement dans l\'image'}
          </p>
        )}
      </div>

      {/* 3. Mode & Execute */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold mb-4">3. Action</h2>

        <div className="space-y-3">
          {[
            {
              mode: AppMode.EDIT,
              label: 'Mise en situation (Standard)',
              sub: 'Rapide - recontextualisation',
            },
            {
              mode: AppMode.VIDEO,
              label: 'Generer une Video',
              sub: 'Veo - Animation lente',
            },
            {
              mode: AppMode.GENERATE,
              label: 'Generation Creative (Pro)',
              sub: 'Creation pure (sans image source)',
            },
          ].map((opt) => (
            <label
              key={opt.mode}
              className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="mode"
                checked={appMode === opt.mode}
                onChange={() => onModeChange(opt.mode)}
                className="text-sola-primary focus:ring-sola-primary accent-sola-primary"
              />
              <div>
                <span className="block font-medium text-gray-900">{opt.label}</span>
                <span className="block text-xs text-gray-500">{opt.sub}</span>
              </div>
            </label>
          ))}
        </div>

        {appMode === AppMode.GENERATE && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
              Resolution
            </label>
            <div className="flex gap-2">
              {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => onProSizeChange(size)}
                  className={`flex-1 py-1 text-xs rounded border ${
                    proSize === size
                      ? 'bg-sola-dark text-white border-sola-dark'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {appMode === AppMode.VIDEO && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">
              Qualite video
            </label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'fast' as VideoQuality, label: 'Fast', desc: 'Rapide, preview' },
                { value: 'pro' as VideoQuality, label: 'Pro', desc: 'Haute qualite + audio' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onVideoQualityChange(opt.value)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    videoQuality === opt.value
                      ? 'border-sola-primary bg-sola-primary/10 ring-1 ring-sola-primary'
                      : 'border-gray-200 bg-white hover:border-sola-primary/50'
                  }`}
                >
                  <span className={`block text-sm font-bold ${videoQuality === opt.value ? 'text-sola-primary' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                  <span className="block text-[10px] text-gray-400 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Aspect Ratio */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <AspectRatioSelector value={aspectRatio} onChange={onAspectRatioChange} appMode={appMode} />
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading || (!uploadedImage && appMode !== AppMode.GENERATE)}
          className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
            isLoading || (!uploadedImage && appMode !== AppMode.GENERATE)
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-sola-primary hover:bg-sola-primary/80 hover:shadow-lg'
          }`}
        >
          {isLoading ? 'Traitement...' : 'Generer'}
        </button>
      </div>
    </div>
  );
};
