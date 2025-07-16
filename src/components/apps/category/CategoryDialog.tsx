import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Chip
} from '@mui/material';
import { useDispatch } from 'src/store/Store';
import { createCategory, editCategory } from 'src/store/apps/category/CategorySlice';
import { CategoryType, CategoryFormData, CategoryStatus, defaultCategoryColors, getRandomCategoryColor } from 'src/types/apps/category';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: CategoryType | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface FormErrors {
  categoryCode?: string;
  categoryName?: string;
  description?: string;
  status?: string;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  category,
  onSuccess,
  onError
}) => {
  const dispatch = useDispatch();
  const isEdit = !!category;

  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryCode: '',
    categoryName: '',
    description: '',
    status: 'active',
    color: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when dialog opens or category changes
  useEffect(() => {
    if (open) {
      if (isEdit && category) {
        setFormData({
          categoryCode: category.categoryCode,
          categoryName: category.categoryName,
          description: category.description,
          status: category.status,
          color: category.color || ''
        });
      } else {
        setFormData({
          categoryCode: '',
          categoryName: '',
          description: '',
          status: 'active',
          color: getRandomCategoryColor()
        });
      }
      setErrors({});
    }
  }, [open, isEdit, category]);

  // Handle form field changes
  const handleChange = (field: keyof CategoryFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Category code validation
    if (!formData.categoryCode.trim()) {
      newErrors.categoryCode = 'Mã danh mục là bắt buộc';
    } else if (formData.categoryCode.length < 2) {
      newErrors.categoryCode = 'Mã danh mục phải có ít nhất 2 ký tự';
    } else if (!/^[A-Z0-9_]+$/.test(formData.categoryCode)) {
      newErrors.categoryCode = 'Mã danh mục chỉ được chứa chữ hoa, số và dấu gạch dưới';
    }

    // Category name validation
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Tên danh mục là bắt buộc';
    } else if (formData.categoryName.length < 2) {
      newErrors.categoryName = 'Tên danh mục phải có ít nhất 2 ký tự';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    }

    // Status validation
    if (!formData.status) {
      newErrors.status = 'Trạng thái là bắt buộc';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEdit && category) {
        await dispatch(editCategory(Number(category.id), formData));
        onSuccess('Cập nhật danh mục thành công!');
      } else {
        await dispatch(createCategory(formData));
        onSuccess('Thêm danh mục mới thành công!');
      }
      handleClose();
    } catch (error: any) {
      onError(error.message || 'Có lỗi xảy ra khi lưu danh mục');
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setFormData({
      categoryCode: '',
      categoryName: '',
      description: '',
      status: 'active',
      color: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Category Code */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mã danh mục"
              value={formData.categoryCode}
              onChange={handleChange('categoryCode')}
              error={!!errors.categoryCode}
              helperText={errors.categoryCode || 'Ví dụ: TECH, HEALTH'}
              required
              disabled={isEdit} // Don't allow editing code for existing categories
              placeholder="TECH"
            />
          </Grid>

          {/* Category Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên danh mục"
              value={formData.categoryName}
              onChange={handleChange('categoryName')}
              error={!!errors.categoryName}
              helperText={errors.categoryName}
              required
              placeholder="Công nghệ"
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả"
              value={formData.description}
              onChange={handleChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              required
              multiline
              rows={3}
              placeholder="Mô tả chi tiết về danh mục này..."
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái"
                onChange={handleChange('status')}
              >
                <MenuItem value={CategoryStatus.ACTIVE}>Hoạt động</MenuItem>
                <MenuItem value={CategoryStatus.INACTIVE}>Không hoạt động</MenuItem>
              </Select>
              {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Color Selection */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Màu sắc
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {defaultCategoryColors.map((color, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: color,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: formData.color === color ? '3px solid #1976d2' : '1px solid #ddd',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      transition: 'transform 0.2s'
                    }
                  }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </Box>
          </Grid>

          {/* Preview */}
          {formData.categoryName && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Xem trước:
              </Typography>
              <Chip
                label={formData.categoryName}
                sx={{
                  backgroundColor: formData.color,
                  color: '#333333',
                  fontWeight: 500
                }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          size="medium"
          sx={{
            minWidth: 80,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          size="medium"
          sx={{
            minWidth: 100,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;
