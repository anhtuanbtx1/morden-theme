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

// Khai báo kiểu cho window
declare global {
  interface Window {
    handleFootballSearch: (term: string) => void;
  }
}


// Import tất cả hình ảnh từ thư mục football/manchester_united
import s1Img from '../../../assets/images/football/manchester_united/Berbatov.png';
import s2Img from '../../../assets/images/football/manchester_united/Owen.png';
import s3Img from '../../../assets/images/football/manchester_united/WellBeck.png';
import s4Img from '../../../assets/images/football/manchester_united/Mount.png';
import s5Img from '../../../assets/images/football/manchester_united/Matic.png';
import s6Img from '../../../assets/images/football/manchester_united/Kagawa.png';
import s7Img from '../../../assets/images/football/manchester_united/Falcao.png';
import s8Img from '../../../assets/images/football/manchester_united/Pogba.png';
import s9Img from '../../../assets/images/football/manchester_united/Yoro.png';
import s10Img from '../../../assets/images/football/manchester_united/Maria.png';
import s11Img from '../../../assets/images/football/manchester_united/Sar.png';
import s12Img from '../../../assets/images/football/manchester_united/Garnacho.png';
import s13Img from '../../../assets/images/football/manchester_united/Fellaini.png';
import s14Img from '../../../assets/images/football/manchester_united/Gea.png';
import s15Img from '../../../assets/images/football/manchester_united/Ronaldo.png';
import s16Img from '../../../assets/images/football/manchester_united/Antony.png';
import s17Img from '../../../assets/images/football/manchester_united/Nistelrooy.png';
import s18Img from '../../../assets/images/football/manchester_united/Eriksen.png';
import s19Img from '../../../assets/images/football/manchester_united/Fred.png';
import s20Img from '../../../assets/images/football/manchester_united/Ligt.png';
import s21Img from '../../../assets/images/football/manchester_united/Martinez.png';
import s22Img from '../../../assets/images/football/manchester_united/Cavani.png';
import s23Img from '../../../assets/images/football/manchester_united/Vidic.png';
import s24Img from '../../../assets/images/football/manchester_united/Ibrahimovic.png';
import s25Img from '../../../assets/images/football/manchester_united/Saha.png';
import s26Img from '../../../assets/images/football/manchester_united/Silvestre.png';
import s27Img from '../../../assets/images/football/manchester_united/Depay.png';
import s28Img from '../../../assets/images/football/manchester_united/Nani.png';
import s29Img from '../../../assets/images/football/manchester_united/Erva.png';
import s30Img from '../../../assets/images/football/manchester_united/Sung.png';
import s31Img from '../../../assets/images/football/manchester_united/Carrick.png';

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const itemsPerPage = 6;

  // Hàm này sẽ được gọi từ component Breadcrumb
  // Bạn có thể thêm vào global state hoặc context nếu cần
  window.handleFootballSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

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
    { src: s8Img, name: 'Pogba', index: 7, category: FootballCategory.CLUB, categoryName: 'Manchester United' },

    // Giải đấu
    { src: s9Img, name: 'Yoro', index: 8, category: FootballCategory.TOURNAMENT, categoryName: 'Manchester United' },
    { src: s10Img, name: 'Di Maria', index: 9, category: FootballCategory.TOURNAMENT, categoryName: 'Manchester United' },
    { src: s11Img, name: 'Van Der Sar', index: 10, category: FootballCategory.TOURNAMENT, categoryName: 'Giải đấu' },
    { src: s12Img, name: 'Garnacho', index: 11, category: FootballCategory.TOURNAMENT, categoryName: 'Giải đấu' },

    // Cầu thủ khác
    { src: s13Img, name: 'Fellaini', index: 12, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s14Img, name: 'Gea', index: 13, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s15Img, name: 'Ronaldo', index: 14, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s16Img, name: 'Antony', index: 15, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s17Img, name: 'Nistelrooy', index: 16, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s18Img, name: 'Eriksen', index: 17, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s19Img, name: 'Fred', index: 18, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s20Img, name: 'Ligt', index: 19, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s21Img, name: 'Martinez', index: 20, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s22Img, name: 'Cavani', index: 21, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s23Img, name: 'Vidic', index: 22, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s24Img, name: 'Ibrahimovic', index: 23, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s25Img, name: 'Saha', index: 24, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s26Img, name: 'Silvestre', index: 25, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s27Img, name: 'Depay', index: 26, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s28Img, name: 'Nani', index: 27, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s29Img, name: 'Erva', index: 28, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s30Img, name: 'Sung', index: 29, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
    { src: s31Img, name: 'Carrick', index: 29, category: FootballCategory.PLAYER, categoryName: 'Cầu thủ' },
  ];

  // Tính toán vị trí bắt đầu và kết thúc cho trang hiện tại
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Lọc hình ảnh theo category và searchTerm
  const filteredImages = footballImages.filter(image => {
    // Lọc theo category nếu có
    const categoryMatch = selectedCategory ? image.category === selectedCategory : true;

    // Lọc theo searchTerm nếu có
    const searchMatch = searchTerm
      ? image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return categoryMatch && searchMatch;
  });

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
          gap: 1.5,
          p: 3,
          borderRadius: 4,
          backgroundColor: 'background.paper',
          boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
          }
        }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              mr: 3,
              alignSelf: 'center',
              color: 'text.primary',
              fontSize: '1rem'
            }}
          >
            Lọc theo category:
          </Typography>

          <Chip
            label="Tất cả"
            color={selectedCategory === null ? "primary" : "default"}
            onClick={() => handleCategoryChange(null)}
            sx={{
              fontWeight: 600,
              borderRadius: 6,
              py: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
          />

          {categories.map((category) => (
            <Chip
              key={category.code}
              label={category.name}
              color={selectedCategory === category.code ? "primary" : "default"}
              onClick={() => handleCategoryChange(category.code)}
              sx={{
                fontWeight: 600,
                borderRadius: 6,
                py: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
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
            p: 5,
            textAlign: 'center',
            borderRadius: 4,
            backgroundColor: 'background.paper',
            boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
            }
          }}>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '1.1rem'
              }}
            >
              Không tìm thấy hình ảnh nào phù hợp
            </Typography>
          </Box>
        </Grid>
      )}

      {/* Phân trang */}
      {currentImages.length > 0 && (
        <Grid item xs={12} display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={filteredTotalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
                margin: '0 2px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  transform: 'translateY(-2px)'
                }
              },
              '& .Mui-selected': {
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
              }
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default FootballListing;
