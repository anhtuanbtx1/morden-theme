import React from 'react';
import { Box } from '@mui/material';
import 'src/assets/css/fullImage.css';

interface FullImageProps {
  src: string;
  alt?: string;
  width?: string | number;
  className?: string;
}

const FullImage = ({
  src,
  alt = '',
  width = '100%',
  className = ''
}: FullImageProps) => {
  return (
    <Box
      className={`full-image-container ${className}`}
      sx={{
        width
      }}
    >
      <img
        src={src}
        alt={alt}
        className="full-image"
      />
    </Box>
  );
};

export default FullImage;
