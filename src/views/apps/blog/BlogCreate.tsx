import React, { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { BlogCategory } from 'src/types/apps/blog/CategoryEnum';
import { IconDeviceFloppy } from '@tabler/icons';

const BlogCreate = () => {
  const navigate = useNavigate();
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
      console.log('Dữ liệu gửi đi:', formData);

      // Ở đây sẽ gọi API để tạo bài viết mới

      // Sau khi tạo thành công, chuyển hướng về trang danh sách
      navigate('/apps/blog/list');
    }
  };

  return (
    <PageContainer title="Tạo bài viết mới" description="Tạo bài viết blog mới">
      <Breadcrumb title="Tạo bài viết mới" subtitle="Thêm bài viết blog mới" />

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

export default BlogCreate;
