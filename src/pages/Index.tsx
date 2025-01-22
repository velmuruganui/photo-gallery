import React, { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import ImageGrid from '@/components/ImageGrid';
import ImagePreview from '@/components/ImagePreview';

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleUpload = (files: File[]) => {
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleClose = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevious = () => {
    setSelectedImageIndex(prev => prev !== null ? Math.max(0, prev - 1) : null);
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => prev !== null ? Math.min(images.length - 1, prev + 1) : null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Image Gallery</h1>
      
      <div className="max-w-2xl mx-auto mb-12">
        <ImageUpload onUpload={handleUpload} />
      </div>

      <ImageGrid 
        images={images} 
        onImageClick={handleImageClick}
      />

      <ImagePreview
        isOpen={selectedImageIndex !== null}
        onClose={handleClose}
        currentImage={selectedImageIndex !== null ? images[selectedImageIndex] : null}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={selectedImageIndex !== null && selectedImageIndex > 0}
        hasNext={selectedImageIndex !== null && selectedImageIndex < images.length - 1}
      />
    </div>
  );
};

export default Index;