import React, { useRef } from 'react';

interface ImageUploaderProps {
  images: string[];
  isDragging: boolean;
  onFileSelect: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onRemoveImage: (index: number) => void;
  onClearAll: () => void;
}

const MAX_IMAGES = 3;

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  isDragging,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemoveImage,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (images.length === 0) {
    return (
      <div className="w-full">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors h-64 flex flex-col items-center justify-center gap-4 ${
            isDragging
              ? 'border-sola-primary bg-sola-primary/5'
              : 'border-gray-300 bg-gray-50 hover:border-sola-primary hover:bg-white'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDragging ? 'bg-sola-primary/20 text-sola-primary' : 'bg-gray-200 text-gray-500'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-700">
              {isDragging ? 'Relâchez pour importer' : 'Glissez-déposez ou cliquez pour importer'}
            </p>
            <p className="text-sm text-gray-400 mt-1">JPG, PNG (Max 5MB) - Jusqu'a 3 images</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white aspect-square"
          >
            <img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-contain p-2" />
            {index === 0 && (
              <span className="absolute top-1.5 left-1.5 bg-sola-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                Principale
              </span>
            )}
            <button
              onClick={() => onRemoveImage(index)}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-xl border-2 border-dashed aspect-square flex flex-col items-center justify-center gap-1 transition-colors ${
              isDragging
                ? 'border-sola-primary bg-sola-primary/5'
                : 'border-gray-300 bg-gray-50 hover:border-sola-primary hover:bg-white'
            }`}
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[10px] text-gray-400 font-medium">Ajouter</span>
          </button>
        )}
      </div>

      {images.length > 1 && (
        <button
          onClick={onClearAll}
          className="mt-2 text-xs text-red-500 hover:text-red-600 font-medium"
        >
          Tout supprimer
        </button>
      )}
    </div>
  );
};
