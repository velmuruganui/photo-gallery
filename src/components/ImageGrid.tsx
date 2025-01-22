import React from 'react';
import { motion } from 'framer-motion';

interface ImageGridProps {
  images: string[];
  onImageClick: (index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick }) => {
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
            src={image}
            alt={`Gallery image ${index + 1}`}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </motion.div>
      ))}
    </div>
  );
};

export default ImageGrid;