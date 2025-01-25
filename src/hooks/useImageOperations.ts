import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ImageData {
  id: string;
  url: string;
  storagePath: string;
  createdAt: string;
}

export const useImageOperations = () => {
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
            storagePath: image.storage_path,
            createdAt: image.created_at
          };
        })
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ storagePath, id }: { storagePath: string, id: string }) => {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([storagePath]);
      
      if (storageError) throw storageError;

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
      toast.success('Images uploaded successfully');
    },
    onError: (error) => {
      toast.error('Error uploading images: ' + error.message);
    },
  });

  return {
    imagesData,
    isLoading,
    deleteMutation,
    uploadMutation
  };
};