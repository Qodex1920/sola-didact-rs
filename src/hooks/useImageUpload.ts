import React, { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 3;

export function useImageUpload() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadedImage = useMemo(() => uploadedImages[0] ?? null, [uploadedImages]);
  const additionalImages = useMemo(() => uploadedImages.slice(1), [uploadedImages]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Format invalide. Seules les images sont acceptées.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image trop lourde. Maximum 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImages((prev) => {
        if (prev.length >= MAX_IMAGES) {
          toast.error(`Maximum ${MAX_IMAGES} images.`);
          return prev;
        }
        return [...prev, reader.result as string];
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = useCallback((index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setUploadedImages([]);
  }, []);

  return {
    uploadedImages,
    uploadedImage,
    additionalImages,
    isDragging,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeImage,
    clearImages,
    clearImage: clearImages,
  };
}
