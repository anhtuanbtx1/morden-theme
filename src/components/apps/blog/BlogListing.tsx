import React, { useEffect, useState } from 'react';
import {
  Grid,
  Pagination,
  Box,
  Chip,
  Typography
} from '@mui/material';
import { useDispatch } from 'src/store/Store';
import { fetchBlogPosts } from 'src/store/apps/blog/BlogSlice';
import FullImageBlogCard from './FullImageBlogCard';
import { BlogCategory } from 'src/types/apps/blog/CategoryEnum';


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
import blogImg11Jpg from '../../../assets/images/blog/Gia_Cat_Luong.png';
import blogImg12Jpg from '../../../assets/images/blog/Acubis.png';
import blogImg13Jpg from '../../../assets/images/blog/Yugioh.png';

// Định nghĩa interface cho đối tượng hình ảnh
interface ImageItem {
  src: string;
  name: string;
  index: number;
  category: string; // categoryCode - dùng để phân loại theo enum
  categoryName: string; // Tên hiển thị của category
}

const BlogListing = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const itemsPerPage = 6;

  // Tạo mảng chứa tất cả hình ảnh
  const blogImages: ImageItem[] = [
    { src: blogImg1Png, name: 'Orochi', index: 0, category: "KOF", categoryName: 'King of Fighters' },
    { src: blogImg2Png, name: 'K', index: 1, category: BlogCategory.KOF, categoryName: 'King of Fighters' },
    { src: blogImg3Png, name: 'Dương Tiễn', index: 2, category: BlogCategory.TAY_DU_KY, categoryName: 'Tây Du Ký' },
    { src: blogImg4Png, name: 'Phật Quan Âm', index: 3, category: BlogCategory.TAY_DU_KY, categoryName: 'Tây Du Ký' },
    { src: blogImg5Png, name: 'Ash Crimson', index: 4, category: BlogCategory.TECHNOLOGY, categoryName: 'King of Fighters' },
    { src: blogImg6Png, name: 'Terry', index: 5, category: BlogCategory.KOF, categoryName: 'King of Fighters' },
    { src: blogImg7Png, name: 'Triển Chiêu', index: 6, category: BlogCategory.ANH_HUNG, categoryName: 'Anh Hùng' },
    { src: blogImg8Png, name: 'Phật Tổ Như Lai', index: 7, category: BlogCategory.TAY_DU_KY, categoryName: 'Tây Du Ký' },
    { src: blogImg9Jpg, name: 'Đường Tam Tạng', index: 8, category: BlogCategory.TAY_DU_KY, categoryName: 'Tây Du Ký' },
    { src: blogImg10Jpg, name: 'Trư Bát Giới', index: 9, category: BlogCategory.TAY_DU_KY, categoryName: 'Tây Du Ký' },
    { src: blogImg11Jpg, name: 'Gia Cát Lượng', index: 10, category: BlogCategory.TAM_QUOC, categoryName: 'Tam Quốc Chí' },
    { src: blogImg12Jpg, name: 'Acubis', index: 11, category: BlogCategory.TECHNOLOGY, categoryName: 'Thần thoại Hy Lạp' },
    { src: blogImg13Jpg, name: 'Yugioh', index: 12, category: BlogCategory.FASHION, categoryName: 'Game' },
  ];

  // Không cần tính toán tổng số trang dựa trên tất cả hình ảnh nữa
  // vì chúng ta sẽ sử dụng filteredTotalPages

  // Tính toán vị trí bắt đầu và kết thúc cho trang hiện tại
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Lọc hình ảnh theo category nếu có
  const filteredImages = selectedCategory
    ? blogImages.filter(image => image.category === selectedCategory)
    : blogImages;

  // Tính toán lại tổng số trang dựa trên hình ảnh đã lọc
  const filteredTotalPages = Math.ceil(filteredImages.length / itemsPerPage);

  // Lấy hình ảnh cho trang hiện tại
  const currentImages = filteredImages.slice(startIndex, endIndex);

  // Xử lý thay đổi trang
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Xử lý khi chọn category
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setPage(1); // Reset về trang đầu tiên khi thay đổi category
  };

  // Lấy danh sách các category duy nhất
  const uniqueCategoryNames = Array.from(new Set(blogImages.map(image => ({
    code: image.category,
    name: image.categoryName
  }))));

  // Loại bỏ các category trùng lặp
  const categories = uniqueCategoryNames.filter((category, index, self) =>
    index === self.findIndex(c => c.code === category.code)
  );

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  return (
    <Grid container spacing={3}>
      {/* Thanh lọc category */}
      <Grid item xs={12} mb={3}>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          p: 2,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mr: 2, alignSelf: 'center' }}>
            Lọc theo category:
          </Typography>

          <Chip
            label="Tất cả"
            color={selectedCategory === null ? "primary" : "default"}
            onClick={() => handleCategoryChange(null)}
            sx={{ fontWeight: 500 }}
          />

          {categories.map((category) => (
            <Chip
              key={category.code}
              label={category.name}
              color={selectedCategory === category.code ? "primary" : "default"}
              onClick={() => handleCategoryChange(category.code)}
              sx={{ fontWeight: 500 }}
            />
          ))}
        </Box>
      </Grid>

      {/* Hiển thị hình ảnh */}
      {currentImages.length > 0 ? (
        currentImages.map((image) => (
          <Grid item xs={12} lg={4} md={4} sm={6} key={image.name} sx={{ display: 'flex' }}>
            <FullImageBlogCard image={image} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Box sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6">Không tìm thấy hình ảnh nào phù hợp</Typography>
          </Box>
        </Grid>
      )}

      {/* Phân trang */}
      {currentImages.length > 0 && (
        <Grid item xs={12} display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={filteredTotalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Grid>
      )}
    </Grid>
  );
};

export default BlogListing;
