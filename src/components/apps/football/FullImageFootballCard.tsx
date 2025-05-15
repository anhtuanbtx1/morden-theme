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
import { getFootballCategoryColorScheme } from 'src/types/apps/football/FootballCategoryEnum';

// Interface cho đối tượng hình ảnh
interface ImageItem {
  src: string;
  name: string;
  index: number;
  category: string; // categoryCode - dùng để phân loại theo enum
  categoryName?: string; // Tên hiển thị của category (optional)
}

const FullImageFootballCard = ({ image }: { image: ImageItem }) => {
  // Tạo dữ liệu giả cho card
  const title = image.name; // Sử dụng trực tiếp tên đã được đặt trong FootballListing
  const category = image.category; // Sử dụng category từ dữ liệu hình ảnh
  const categoryName = image.categoryName || category; // Sử dụng categoryName nếu có, nếu không thì dùng category
  const view = Math.floor(Math.random() * 1000) + 100;
  const comments = Math.floor(Math.random() * 50);
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - (image.index % 30));

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
        <Box sx={{
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={300}
          />
          <Box sx={{ p: 3 }}>
            <Skeleton animation="wave" height={60} width="80%" sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton animation="wave" height={30} width="40%" sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton animation="wave" height={20} width="100%" />
          </Box>
        </Box>
      ) : (
        <BlankCard
          className="hoverCard"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
            }
          }}
        >
          <>
            <Box sx={{
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 100%)',
                zIndex: 1,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::before': {
                opacity: 1
              }
            }}>
              <CardMedia
                component="img"
                height="300"
                image={image.src}
                alt={title}
                sx={{
                  objectFit: 'cover',
                  width: '100%',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
            </Box>
            <CardContent className="card-content" sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  color="inherit"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '64px',
                    fontWeight: 700,
                    textAlign: 'center',
                    color: 'text.primary',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                  component={Link}
                  to={`#`}
                >
                  {title}
                </Typography>
                <Stack direction="row" justifyContent="center" mt={1}>
                  <Chip
                    label={categoryName}
                    size="small"
                    sx={{
                      backgroundColor: getFootballCategoryColorScheme(category).backgroundColor,
                      color: getFootballCategoryColorScheme(category).textColor,
                      fontWeight: 600,
                      borderRadius: '12px',
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                      }
                    }}
                  />
                </Stack>
              </Box>
              <Stack
                direction="row"
                gap={3}
                alignItems="center"
                sx={{
                  marginTop: 'auto',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(0,0,0,0.08)',
                  mt: 3
                }}
              >
                <Stack direction="row" gap={1} alignItems="center">
                  <IconEye size="18" color="#1976d2" />
                  <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary' }}>{view}</Typography>
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  <IconMessage2 size="18" color="#1976d2" />
                  <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary' }}>{comments}</Typography>
                </Stack>

                <Stack direction="row" ml="auto" alignItems="center">
                  <IconPoint size="16" color="#1976d2" />
                  <Typography variant="body2" fontWeight={600} sx={{
                    color: 'text.secondary',
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    borderRadius: '12px',
                    padding: '4px 8px',
                  }}>
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

export default FullImageFootballCard;
