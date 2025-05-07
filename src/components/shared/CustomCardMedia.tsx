import React from 'react';
import { Box, styled } from '@mui/material';

interface CustomCardMediaProps {
  src: string;
  alt?: string;
  className?: string;
}

const MediaContainer = styled(Box)({
  display: 'flex',
  minHeight: '300px',
  height: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'visible',
  position: 'relative',
  width: '100%',
  borderRadius: '12px',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&.blog-card-image': {
    minHeight: '300px',
    height: 'auto',
  }
});

const MediaImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
  objectPosition: 'center',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  }
});

const CustomCardMedia = ({
  src,
  alt = '',
  className = ''
}: CustomCardMediaProps) => {
  return (
    <MediaContainer className={className}>
      <MediaImage
        src={src}
        alt={alt}
        loading="lazy"
      />
    </MediaContainer>
  );
};

export default CustomCardMedia;
