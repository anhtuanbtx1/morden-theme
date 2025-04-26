import React from 'react';
import { Box, styled } from '@mui/material';

interface CustomCardMediaProps {
  src: string;
  alt?: string;
  className?: string;
}

const MediaContainer = styled(Box)({
  display: 'flex',
  height: '300px',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

const MediaImage = styled('img')({
  maxWidth: '100%',
  width: '300px',
  height: '300px',
  objectFit: 'contain',
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
      />
    </MediaContainer>
  );
};

export default CustomCardMedia;
