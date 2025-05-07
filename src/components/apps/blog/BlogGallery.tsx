import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  CardMedia,
  CardContent,
  Typography,
  Skeleton,
  Button,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { IconX } from '@tabler/icons';
import BlankCard from '../../shared/BlankCard';

// Định nghĩa interface cho đối tượng hình ảnh
interface ImageItem {
  src: string;
  name: string;
}

// Import tất cả hình ảnh từ thư mục blog
// Sử dụng import trực tiếp thay vì require.context
import blogImg1Png from '../../../assets/images/blog/blog-img1.png';
import blogImg2Png from '../../../assets/images/blog/blog-img2.png';
import blogImg3Png from '../../../assets/images/blog/blog-img3.png';
import blogImg4Png from '../../../assets/images/blog/blog-img4.png';
import blogImg5Png from '../../../assets/images/blog/blog-img5.png';
import blogImg6Png from '../../../assets/images/blog/blog-img6.png';
import blogImg7Png from '../../../assets/images/blog/blog-img7.png';
import blogImg8Png from '../../../assets/images/blog/blog-img8.png';
import blogImg9Jpg from '../../../assets/images/blog/blog-img9.jpg';
import blogImg10Jpg from '../../../assets/images/blog/blog-img10.jpg';

// Tạo mảng chứa tất cả hình ảnh
const blogImages: ImageItem[] = [
  { src: blogImg1Png, name: 'Hình ảnh Orochi' },
  { src: blogImg2Png, name: 'Hình ảnh blog-img2' },
  { src: blogImg3Png, name: 'Hình ảnh blog-img3' },
  { src: blogImg4Png, name: 'Hình ảnh blog-img4' },
  { src: blogImg5Png, name: 'Hình ảnh blog-img5' },
  { src: blogImg6Png, name: 'Hình ảnh blog-img6' },
  { src: blogImg7Png, name: 'Hình ảnh blog-img7' },
  { src: blogImg8Png, name: 'Hình ảnh blog-img8' },
  { src: blogImg9Jpg, name: 'Hình ảnh blog-img9' },
  { src: blogImg10Jpg, name: 'Hình ảnh blog-img10' },
];

const BlogGallery = () => {
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Giả lập thời gian tải
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenImage = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Log số lượng hình ảnh để kiểm tra
  useEffect(() => {
    console.log(`Đã tải ${blogImages.length} hình ảnh`);
  }, []);

  return (
    <Box>
      <Typography variant="h4" mb={1}>
        Thư viện hình ảnh Blog
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={3}>
        Hiển thị tất cả {blogImages.length} hình ảnh
      </Typography>

      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(12)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={200}
                  sx={{ borderRadius: 1 }}
                />
              </Grid>
            ))
          : blogImages.map((image: ImageItem, index: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <BlankCard>
                  <Box
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      '&:hover .image-overlay': {
                        opacity: 1,
                      },
                    }}
                    onClick={() => handleOpenImage(image.src)}
                  >
                    <CardMedia
                      component="img"
                      height="250"
                      image={image.src}
                      alt={image.name}
                      sx={{
                        objectFit: 'cover',
                        aspectRatio: '4/3',
                        width: '100%',
                      }}
                    />
                    <Box
                      className="image-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      <Button variant="contained" color="primary" size="small">
                        Xem
                      </Button>
                    </Box>
                  </Box>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="subtitle1" noWrap>
                      {image.name}
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
            ))}
      </Grid>

      {/* Dialog hiển thị hình ảnh đầy đủ */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 1, position: 'relative' }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              bgcolor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.7)',
              },
            }}
          >
            <IconX />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BlogGallery;
