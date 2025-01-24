import React, { useState } from 'react';
import { Image, Upload, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';
import ImageGrid from '@/components/ImageGrid';
import ImagePreview from '@/components/ImagePreview';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      toast.error('Error logging out');
    }
  };

  const handleUpload = (files: File[]) => {
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
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
    setSelectedImageIndex(prev => prev !== null ? Math.min(images.length - 1, prev + 1) : null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gallery-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-8 h-8 text-gallery-accent" />
            <span className="text-xl font-semibold">Gallery</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowUploadDialog(true)}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button 
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8">
        {showUploadDialog && (
          <div className="max-w-2xl mx-auto mb-12">
            <ImageUpload onUpload={handleUpload} />
          </div>
        )}

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
      </main>
    </div>
  );
};

export default Index;