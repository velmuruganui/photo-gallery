import React, { useState } from 'react';
import { Image, Upload, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';
import ImageGrid from '@/components/ImageGrid';
import ImagePreview from '@/components/ImagePreview';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Index = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: imagesData = [], isLoading } = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return Promise.all(
        images.map(async (image) => {
          const { data } = supabase.storage
            .from('gallery')
            .getPublicUrl(image.storage_path);
          return {
            id: image.id,
            url: data.publicUrl,
            storagePath: image.storage_path
          };
        })
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ storagePath, id }: { storagePath: string, id: string }) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([storagePath]);
      
      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success('Image deleted successfully');
    },
    onError: (error) => {
      toast.error('Error deleting image: ' + error.message);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const filePath = `${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { error: dbError } = await supabase.from('images').insert({
            storage_path: filePath,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          });

          if (dbError) throw dbError;

          const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
          return data.publicUrl;
        })
      );

      return uploadedImages;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      setShowUploadDialog(false);
      toast.success('Images uploaded successfully');
    },
    onError: (error) => {
      toast.error('Error uploading images: ' + error.message);
    },
  });

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
    uploadMutation.mutate(files);
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
          images={imagesData.map(img => img.url)}
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