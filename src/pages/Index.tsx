import React, { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import ImageGrid from '@/components/ImageGrid';
import ImagePreview from '@/components/ImagePreview';
import Header from '@/components/Header';
import { useImageOperations } from '@/hooks/useImageOperations';

const Index = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { imagesData, isLoading, deleteMutation, uploadMutation } = useImageOperations();

  const handleUpload = (files: File[]) => {
    uploadMutation.mutate(files);
    setShowUploadDialog(false);
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
    setSelectedImageIndex(prev => prev !== null ? Math.min(imagesData.length - 1, prev + 1) : null);
  };

  const handleDelete = async (index: number) => {
    const image = imagesData[index];
    if (!image) return;
    
    deleteMutation.mutate({
      storagePath: image.storagePath,
      id: image.id
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const formattedImages = imagesData.map(img => ({
    url: img.url,
    createdAt: img.createdAt
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header onUploadClick={() => setShowUploadDialog(true)} />

      <main className="flex-1 container mx-auto py-8">
        {showUploadDialog && (
          <div className="max-w-2xl mx-auto mb-12">
            <ImageUpload onUpload={handleUpload} />
          </div>
        )}

        <ImageGrid 
          images={formattedImages}
          onImageClick={handleImageClick}
          onDelete={handleDelete}
        />

        <ImagePreview
          isOpen={selectedImageIndex !== null}
          onClose={handleClose}
          currentImage={selectedImageIndex !== null ? imagesData[selectedImageIndex]?.url : null}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={selectedImageIndex !== null && selectedImageIndex > 0}
          hasNext={selectedImageIndex !== null && selectedImageIndex < imagesData.length - 1}
        />
      </main>
    </div>
  );
};

export default Index;