import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { BlogCategory } from 'src/types/apps/blog/CategoryEnum';
import { IconDeviceFloppy } from '@tabler/icons';
import { useSelector, useDispatch } from 'src/store/Store';
import { AppState } from 'src/store/Store';
import { fetchBlogPosts } from 'src/store/apps/blog/BlogSlice';
import { BlogPostType } from 'src/types/apps/blog';

const BlogEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    coverImg: '',
  });

  const [errors, setErrors] = useState({
    title: false,
    content: false,
    category: false,
    coverImg: false,
  });

  // Lấy danh sách bài viết từ Redux store
  const blogPosts = useSelector((state: AppState) => state.blogReducer.blogposts as BlogPostType[]);

  // Tìm bài viết cần chỉnh sửa
  useEffect(() => {
    try {
      dispatch(fetchBlogPosts());
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu blog:', error);
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (blogPosts.length > 0 && id) {
      const post = blogPosts.find(post => post.id === parseInt(id));
      if (post) {
        setFormData({
          title: post.title || '',
          content: post.content || '',
          category: post.category || '',
          coverImg: post.coverImg || '',
        });
      } else {
        // Nếu không tìm thấy bài viết, hiển thị thông báo và chuyển hướng về trang danh sách
        console.error(`Không tìm thấy bài viết với ID: ${id}`);
        navigate('/apps/blog/list');

        return;
      }
    }

    // Đảm bảo loading được tắt sau một khoảng thời gian, ngay cả khi không có dữ liệu
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [blogPosts, id, navigate]);

  // Xử lý thay đổi input cho TextField
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: string };
    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi khi người dùng nhập
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  // Xử lý thay đổi input cho Select
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi khi người dùng chọn
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra lỗi
    const newErrors = {
      title: !formData.title,
      content: !formData.content,
      category: !formData.category,
      coverImg: !formData.coverImg,
    };

    setErrors(newErrors);

    // Nếu không có lỗi, gửi dữ liệu
    if (!Object.values(newErrors).some(Boolean)) {
      console.log('Dữ liệu cập nhật:', formData);

      // Ở đây sẽ gọi API để cập nhật bài viết

      // Sau khi cập nhật thành công, chuyển hướng về trang danh sách
      navigate('/apps/blog/list');
    }
  };

  if (loading) {
    return (
      <PageContainer title="Chỉnh sửa bài viết" description="Đang tải...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Chỉnh sửa bài viết" description="Chỉnh sửa bài viết blog">
      <Breadcrumb title="Chỉnh sửa bài viết" subtitle="Cập nhật thông tin bài viết" />

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" mb={2}>
                  Thông tin bài viết
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tiêu đề"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  helperText={errors.title ? 'Tiêu đề không được để trống' : ''}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nội dung"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  error={errors.content}
                  helperText={errors.content ? 'Nội dung không được để trống' : ''}
                  multiline
                  rows={6}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={errors.category}>
                  <InputLabel id="category-label">Danh mục</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    label="Danh mục"
                    onChange={handleSelectChange}
                    required
                  >
                    {Object.values(BlogCategory).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <FormHelperText>Vui lòng chọn danh mục</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL hình ảnh"
                  name="coverImg"
                  value={formData.coverImg}
                  onChange={handleChange}
                  error={errors.coverImg}
                  helperText={errors.coverImg ? 'URL hình ảnh không được để trống' : ''}
                  required
                />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 1 }}
                  onClick={() => navigate('/apps/blog/list')}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<IconDeviceFloppy width={18} height={18} />}
                >
                  Lưu
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default BlogEdit;
