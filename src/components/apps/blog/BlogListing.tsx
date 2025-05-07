import React, { useEffect, useState } from 'react';
import { Grid, Pagination } from '@mui/material';
import { useDispatch } from 'src/store/Store';
import { fetchBlogPosts } from 'src/store/apps/blog/BlogSlice';
import FullImageBlogCard from './FullImageBlogCard';


// Import tất cả hình ảnh từ thư mục blog
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

// Định nghĩa interface cho đối tượng hình ảnh
interface ImageItem {
  src: string;
  name: string;
  index: number;
}

const BlogListing = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Tạo mảng chứa tất cả hình ảnh
  const blogImages: ImageItem[] = [
    { src: blogImg1Png, name: 'Orochi', index: 0 },
    { src: blogImg2Png, name: 'Hình ảnh blog-img2', index: 1 },
    { src: blogImg3Png, name: 'Hình ảnh blog-img3', index: 2 },
    { src: blogImg4Png, name: 'Hình ảnh blog-img4', index: 3 },
    { src: blogImg5Png, name: 'Hình ảnh blog-img5', index: 4 },
    { src: blogImg6Png, name: 'Hình ảnh blog-img6', index: 5 },
    { src: blogImg7Png, name: 'Hình ảnh blog-img7', index: 6 },
    { src: blogImg8Png, name: 'Hình ảnh blog-img8', index: 7 },
    { src: blogImg9Jpg, name: 'Hình ảnh blog-img9', index: 8 },
    { src: blogImg10Jpg, name: 'Hình ảnh blog-img10', index: 9 },
  ];

  // Tính toán tổng số trang dựa trên tất cả hình ảnh
  const totalPages = Math.ceil(blogImages.length / itemsPerPage);

  // Tính toán vị trí bắt đầu và kết thúc cho trang hiện tại
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Lấy tất cả hình ảnh cho trang hiện tại
  const currentImages = blogImages.slice(startIndex, endIndex);

  // Xử lý thay đổi trang
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  return (
    <Grid container spacing={3}>
      {/* Hiển thị tất cả hình ảnh dưới dạng card bình thường */}
      {currentImages.map((image) => (
        <Grid item xs={12} lg={4} md={4} sm={6} key={image.name} sx={{ display: 'flex' }}>
          <FullImageBlogCard image={image} />
        </Grid>
      ))}

      {/* Phân trang */}
      <Grid item xs={12} display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Grid>
    </Grid>
  );
};

export default BlogListing;
