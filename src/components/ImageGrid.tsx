import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ImageGridProps {
  images: {
    url: string;
    createdAt: string;
  }[];
  onImageClick: (index: number) => void;
  onDelete: (index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
          onClick={() => onImageClick(index)}
        >
          <img
            src={image.url}
            alt={`Gallery image ${index + 1}`}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
            {format(new Date(image.createdAt), 'MMMM yyyy')}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
            className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default ImageGrid;