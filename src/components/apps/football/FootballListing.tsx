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
import FullImageFootballCard from './FullImageFootballCard';
import { FootballCategory } from 'src/types/apps/football/FootballCategoryEnum';


// Import tất cả hình ảnh từ thư mục football/manchester_united
import s1Img from '../../../assets/images/football/manchester_united/Berbatov.png';
import s2Img from '../../../assets/images/football/manchester_united/Owen.png';
import s3Img from '../../../assets/images/football/manchester_united/WellBeck.png';
import s4Img from '../../../assets/images/football/manchester_united/Mount.png';
import s5Img from '../../../assets/images/football/manchester_united/Matic.png';
import s6Img from '../../../assets/images/football/manchester_united/Kagawa.png';
import s7Img from '../../../assets/images/football/manchester_united/Falcao.png';
import s8Img from '../../../assets/images/football/manchester_united/s8.jpg';
import s9Img from '../../../assets/images/football/manchester_united/s9.jpg';
import s10Img from '../../../assets/images/football/manchester_united/s10.jpg';
import s11Img from '../../../assets/images/football/manchester_united/s11.jpg';
import s12Img from '../../../assets/images/football/manchester_united/s12.jpg';
import s13Img from '../../../assets/images/football/other/CR7_anas.png';

// Định nghĩa interface cho đối tượng hình ảnh
interface ImageItem {
  src: string;
  name: string;
  index: number;
  category: string; // categoryCode - dùng để phân loại theo enum
  categoryName: string; // Tên hiển thị của category
}

const FootballListing = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const itemsPerPage = 6;

  // Sử dụng FootballCategory từ file FootballCategoryEnum.ts

  // Tạo mảng chứa tất cả hình ảnh
  const footballImages: ImageItem[] = [
    // Cầu thủ
    { src: s1Img, name: 'Berbatov', index: 0, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s2Img, name: 'Owen', index: 1, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s3Img, name: 'WellBeck', index: 2, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s4Img, name: 'Mount', index: 3, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },

    // Câu lạc bộ
    { src: s5Img, name: 'Matic', index: 4, category: FootballCategory.CLUB, categoryName: 'Manchester United' },
    { src: s6Img, name: 'Kagawa', index: 5, category: FootballCategory.CLUB, categoryName: 'Manchester United' },
    { src: s7Img, name: 'Falcao', index: 6, category: FootballCategory.CLUB, categoryName: 'Manchester United' },
    { src: s8Img, name: 'Bayern Munich', index: 7, category: FootballCategory.CLUB, categoryName: 'Câu lạc bộ' },

    // Giải đấu
    { src: s9Img, name: 'FIFA World Cup 2022', index: 8, category: FootballCategory.TOURNAMENT, categoryName: 'Giải đấu' },
    { src: s10Img, name: 'UEFA Champions League', index: 9, category: FootballCategory.TOURNAMENT, categoryName: 'Giải đấu' },
    { src: s11Img, name: 'Premier League', index: 10, category: FootballCategory.TOURNAMENT, categoryName: 'Giải đấu' },
    { src: s12Img, name: 'Serie A', index: 11, category: FootballCategory.TOURNAMENT, categoryName: 'Giải đấu' },

    // Cầu thủ khác
    { src: s13Img, name: 'Cristiano Ronaldo', index: 12, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
  ];

  // Tính toán vị trí bắt đầu và kết thúc cho trang hiện tại
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Lọc hình ảnh theo category nếu có
  const filteredImages = selectedCategory
    ? footballImages.filter(image => image.category === selectedCategory)
    : footballImages;

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
  const uniqueCategoryNames = Array.from(new Set(footballImages.map(image => ({
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
            <FullImageFootballCard image={image} />
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

export default FootballListing;
