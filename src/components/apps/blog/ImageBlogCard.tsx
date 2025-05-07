import React, { useEffect } from 'react';
import {
  CardContent,
  Stack,
  Typography,
  Chip,
  Box,
  Skeleton,
  CardMedia
} from '@mui/material';
import { Link } from 'react-router-dom';
import { IconEye, IconMessage2, IconPoint } from '@tabler/icons';
import BlankCard from '../../shared/BlankCard';
import { format } from 'date-fns';
import { BlogCategory } from 'src/types/apps/blog/CategoryEnum';
import { getCategoryColorScheme } from 'src/types/apps/blog/CategoryEnum';

// Interface cho đối tượng hình ảnh
interface ImageItem {
  src: string;
  name: string;
  index: number;
}

const ImageBlogCard = ({ image }: { image: ImageItem }) => {
  // Tạo dữ liệu giả cho card
  const title = image.name; // Sử dụng trực tiếp tên đã được đặt trong BlogListing
  const category = Object.values(BlogCategory)[image.index % Object.values(BlogCategory).length];
  const view = Math.floor(Math.random() * 1000) + 100;
  const comments = Math.floor(Math.random() * 50);
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - (image.index % 30));

  // Tạo link từ tên hình ảnh (không sử dụng trong component này)
  // const linkTo = title
  //   .toLowerCase()
  //   .replace(/ /g, '-')
  //   .replace(/[^\w-]+/g, '');

  // Skeleton loading
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {isLoading ? (
        <>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ borderRadius: '16px' }}
          ></Skeleton>
        </>
      ) : (
        <BlankCard
          className="hoverCard uniform-card"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <>
            <Box
              className="card-image-container"
              sx={{
                width: '100%',
                height: '300px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={image.src}
                alt={title}
                sx={{
                  objectFit: 'cover',
                  width: '100%',
                }}
              />
            </Box>
            <CardContent className="card-content">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  color="inherit"
                  className="card-title"
                  component={Link}
                  to={`#`}
                >
                  {title}
                </Typography>
                <Stack direction="row" justifyContent="center" mt={1}>
                  <Chip
                    label={category}
                    size="small"
                    sx={{
                      backgroundColor: getCategoryColorScheme(category).backgroundColor,
                      color: getCategoryColorScheme(category).textColor,
                      fontWeight: 600,
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '0.85rem'
                    }}
                  />
                </Stack>
              </Box>
              <Stack
                direction="row"
                gap={3}
                alignItems="center"
                className="card-footer"
              >
                <Stack direction="row" gap={1} alignItems="center">
                  <IconEye size="18" />
                  <Typography variant="body2" fontWeight={500}>{view}</Typography>
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  <IconMessage2 size="18" />
                  <Typography variant="body2" fontWeight={500}>{comments}</Typography>
                </Stack>

                <Stack direction="row" ml="auto" alignItems="center">
                  <IconPoint size="16" />
                  <Typography variant="body2" fontWeight={500}>
                    {format(new Date(createdAt), 'E, MMM d')}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </>
        </BlankCard>
      )}
    </Box>
  );
};

export default ImageBlogCard;
