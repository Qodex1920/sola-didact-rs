import React, { useRef } from 'react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageSelected: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix if present for API calls usually, but display needs it. 
        // We will strip it in service if needed, keep full string here for preview.
        onImageSelected(base64String);
      };
      reader.readAsDataURL(file);
    }
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
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-sola-brick hover:bg-white transition-colors h-64 flex flex-col items-center justify-center gap-4 bg-gray-50"
        >
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-700">Cliquez pour importer un produit</p>
            <p className="text-sm text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
          <img 
            src={currentImage} 
            alt="Uploaded product" 
            className="w-full h-64 object-contain p-4"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-sola-text px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-100"
             >
                Changer l'image
             </button>
          </div>
        </div>
      )}
    </div>
  );
};