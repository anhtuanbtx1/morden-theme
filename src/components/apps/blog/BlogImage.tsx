import React from 'react';
import { Box, styled } from '@mui/material';
import FullImage from 'src/components/shared/FullImage';
import 'src/assets/css/fullImage.css';

interface BlogImageProps {
  src: string;
  alt?: string;
  caption?: string;
  width?: string | number;
}

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  margin: theme.spacing(2, 0),
  '& figcaption': {
    textAlign: 'center',
    marginTop: theme.spacing(1),
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  }
}));

const BlogImage = ({ src, alt = '', caption, width = '100%' }: BlogImageProps) => {
  return (
    <ImageWrapper>
      <figure>
        <FullImage
          src={src}
          alt={alt}
          width={width}
        />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    </ImageWrapper>
  );
};

export default BlogImage;
