import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string | null;
  onPrevious: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  isOpen,
  onClose,
  currentImage,
  onPrevious,
  onNext,
  hasNext,
  hasPrevious,
}) => {
  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/90">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="h-6 w-6 text-white" />
        </button>
        
        {hasPrevious && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}
        
        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
        
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={currentImage}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreview;