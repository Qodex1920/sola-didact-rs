import React, { useRef } from 'react';

interface ImageUploaderProps {
  currentImage: string | null;
  isDragging: boolean;
  onFileSelect: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  isDragging,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {!currentImage ? (
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
            <p className="text-sm text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
          </div>
        </div>
      ) : (
        <div
          className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <img src={currentImage} alt="Uploaded product" className="w-full h-64 object-contain p-4" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-sola-text px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-100"
            >
              Changer
            </button>
            <button
              onClick={onClear}
              className="bg-red-500 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
