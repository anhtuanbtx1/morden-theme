import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CardContent,
  Stack,
  Typography,
  Chip,
  Grid,
  Box,
  alpha,
  styled,
  Skeleton
} from '@mui/material';
import { IconEye, IconMessage2, IconPoint } from '@tabler/icons';
import { format } from 'date-fns';
import BlankCard from '../../shared/BlankCard';
import CustomCardMedia from '../../shared/CustomCardMedia';
import { BlogCategory } from 'src/types/apps/blog/CategoryEnum';
import { getCategoryColorScheme } from 'src/types/apps/blog/CategoryEnum';

const CoverImgStyle = styled(CardContent)({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: 2,
  width: '100%',
  height: '100%',
  color: 'white',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const CoverBox = styled(Box)({
  top: 0,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
  zIndex: 1,
});

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

// Interface cho đối tượng hình ảnh
interface ImageItem {
  src: string;
  name: string;
  index: number;
}

const ImageFeaturedCard = ({ image }: { image: ImageItem }) => {
  // Tạo dữ liệu giả cho card
  const title = `Hình ảnh ${image.name}`;
  const category = Object.values(BlogCategory)[image.index % Object.values(BlogCategory).length];
  const view = Math.floor(Math.random() * 1000) + 100;
  const comments = Math.floor(Math.random() * 50);
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - (image.index % 30));

  // Không còn sử dụng mainPost vì tất cả card có cùng kích thước

  const CoverImgBg = styled(BlankCard)({
    p: 0,
    height: 'auto',
    minHeight: '450px',
    maxHeight: '500px',
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    }
  });

  // Skeleton loading
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Grid
        item
        xs={12}
        lg={4}
        md={4}
        sm={12}
        display="flex"
        alignItems="stretch"
      >
        {isLoading ? (
          <>
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height={500}
              sx={{ borderRadius: '16px' }}
            ></Skeleton>
          </>
        ) : (
          <CoverImgBg className="hoverCard">
            <ImageContainer>
              <Link
                to={`#`}
                style={{ display: 'block', width: '100%', height: '100%' }}
              >
                <CustomCardMedia
                  src={image.src}
                  alt={title}
                />
                <CoverBox
                  sx={{ backgroundColor: (theme) => alpha(theme.palette.grey[900], 0.6) }}
                />
              </Link>
              <CoverImgStyle>
                <Box
                  height={'100%'}
                  display={'flex'}
                  justifyContent="space-between"
                  flexDirection="column"
                >
                  <Box>
                    <Stack direction="row">
                      <Chip
                        sx={{ marginLeft: 'auto' }}
                        label="2 min Read"
                        size="small"
                      ></Chip>
                    </Stack>
                  </Box>
                  <Box>
                    <Box my={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography
                        gutterBottom
                        variant="h3"
                        color="inherit"
                        sx={{
                          textDecoration: 'none',
                          textAlign: 'center',
                          width: '100%'
                        }}
                        component={Link}
                        to={`#`}
                      >
                        {title}
                      </Typography>
                      <Stack direction="row" justifyContent="center" mt={1} mb={2}>
                        <Chip
                          label={category}
                          size="small"
                          sx={{
                            backgroundColor: getCategoryColorScheme(category).backgroundColor,
                            color: getCategoryColorScheme(category).textColor,
                            fontWeight: 500
                          }}
                        />
                      </Stack>
                    </Box>
                    <Stack direction="row" gap={3} alignItems="center">
                      <Stack direction="row" gap={1} alignItems="center">
                        <IconEye size="18" /> {view}
                      </Stack>
                      <Stack direction="row" gap={1} alignItems="center">
                        <IconMessage2 size="18" /> {comments}
                      </Stack>

                      <Stack direction="row" ml="auto" alignItems="center">
                        <IconPoint size="16" />
                        <small>{format(new Date(createdAt), 'E, MMM d')}</small>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              </CoverImgStyle>
            </ImageContainer>
          </CoverImgBg>
        )}
      </Grid>
    </>
  );
};

export default ImageFeaturedCard;
