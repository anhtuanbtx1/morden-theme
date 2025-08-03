import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  IconButton,
  Tooltip,
  FormControlLabel,
  Typography,
  Avatar,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { format } from 'date-fns';
import { useDispatch } from 'src/store/Store';
import { fetchProducts } from 'src/store/apps/eCommerce/ECommerceSlice';
import ProductService from 'src/services/ProductService';
import { IconTrash, IconEdit, IconUpload, IconX } from '@tabler/icons';
import CustomSwitch from 'src/components/forms/theme-elements/CustomSwitch';
import EnhancedTableToolbar from 'src/components/shared/EnhancedTableToolbar';
import { ProductType } from 'src/types/apps/eCommerce';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Sản phẩm',
  },
  {
    id: 'pname',
    numeric: false,
    disablePadding: false,
    label: 'Ngày tạo',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Trạng thái',
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'Giá',
  },
  {
    id: 'salesPrice',
    numeric: false,
    disablePadding: false,
    label: 'Giá đã bán',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'Hành động',
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}



const ProductTableList = () => {
  const [order] = React.useState<Order>('asc');
  const [orderBy] = React.useState<any>('calories');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = React.useState<ProductType[]>([]);
  const [rows, setRows] = React.useState<any>([]);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [productToDelete, setProductToDelete] = React.useState<any>(null);
  const [productToEdit, setProductToEdit] = React.useState<any>(null);
  const [newProduct, setNewProduct] = React.useState({
    title: '',
    price: '',
    description: '',
    category: '',
    stock: true,
    photo: '',
    qty: '1',
    salesPrice: ''
  });
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [editProduct, setEditProduct] = React.useState({
    title: '',
    price: '',
    description: '',
    category: '',
    stock: true,
    photo: '',
    qty: '1',
    salesPrice: ''
  });
  const [editSelectedFile, setEditSelectedFile] = React.useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = React.useState<string>('');
  const [formErrors, setFormErrors] = React.useState<any>({});
  const [editFormErrors, setEditFormErrors] = React.useState<any>({});
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string>('');
  const [selectedImageTitle, setSelectedImageTitle] = React.useState<string>('');

  // Load products from service
  const loadProducts = () => {
    const products = ProductService.getVisibleProducts();
    setAllProducts(products);
  };

  React.useEffect(() => {
    dispatch(fetchProducts());
    loadProducts();
  }, [dispatch]);

  const filterProducts = React.useCallback((searchTerm: string, categories: string[], status: string) => {
    let filteredRows: ProductType[] = allProducts;

    // Filter by search term
    if (searchTerm) {
      filteredRows = filteredRows.filter((row) =>
        row.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by categories (multiple selection)
    if (categories.length > 0) {
      filteredRows = filteredRows.filter((row) => {
        const productCategory = Array.isArray(row.category) ? row.category[0] : row.category;

        return categories.includes(productCategory);
      });
    }

    // Filter by status
    if (status !== 'all') {
      filteredRows = filteredRows.filter((row) => {
        if (status === 'instock') {
          return row.stock === true;
        } else if (status === 'outofstock') {
          return row.stock === false;
        }

        return true;
      });
    }

    setRows(filteredRows);
  }, [allProducts]);

  React.useEffect(() => {
    if (allProducts.length > 0) {
      filterProducts(search, categoryFilter, statusFilter);
    }
  }, [allProducts, search, categoryFilter, statusFilter, filterProducts]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearch(searchValue);
    filterProducts(searchValue, categoryFilter, statusFilter);
  };

  const handleCategoryChange = (categories: string[]) => {
    setCategoryFilter(categories);
    filterProducts(search, categories, statusFilter);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    filterProducts(search, categoryFilter, status);
  };

  const handleResetData = () => {
    if (window.confirm('Bạn có chắc chắn muốn reset về dữ liệu ban đầu? Tất cả sản phẩm đã thêm/sửa sẽ bị mất!')) {
      ProductService.resetToMockData();
      loadProducts();
      setSnackbarMessage('Đã reset về dữ liệu ban đầu!');
      setSnackbarOpen(true);
    }
  };



  // Handle image file upload
  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setSnackbarMessage('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, GIF, WebP)');
        setSnackbarOpen(true);

        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setSnackbarMessage('Kích thước file không được vượt quá 5MB');
        setSnackbarOpen(true);

        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        setNewProduct({ ...newProduct, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear file selection
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setNewProduct({ ...newProduct, photo: '' });
  };

  // Handle file upload for edit form
  const handleEditFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setSnackbarMessage('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, GIF, WebP)');
        setSnackbarOpen(true);

        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setSnackbarMessage('Kích thước file không được vượt quá 5MB');
        setSnackbarOpen(true);

        return;
      }

      setEditSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditPreviewUrl(result);
        setEditProduct({ ...editProduct, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear edit file selection
  const handleClearEditFile = () => {
    setEditSelectedFile(null);
    setEditPreviewUrl('');
    setEditProduct({ ...editProduct, photo: productToEdit?.photo || '' });
  };

  return (
    <Box>
      <Box>
        <EnhancedTableToolbar
          title="Danh sách sản phẩm"
          numSelected={0}
          search={search}
          onSearchChange={(event: any) => handleSearch(event)}
          searchPlaceholder="Tìm kiếm sản phẩm"
          onAddClick={() => setAddDialogOpen(true)}
          addButtonText="Thêm"
          filters={[
            {
              label: "Danh mục",
              value: categoryFilter,
              options: [
                { value: "Electronics", label: "Điện tử" },
                { value: "Clothing", label: "Thời trang" },
                { value: "Books", label: "Sách" },
                { value: "Home", label: "Gia dụng" },
                { value: "Sports", label: "Thể thao" }
              ],
              onChange: handleCategoryChange,
              multiple: true,
              minWidth: 200
            },
            {
              label: "Trạng thái",
              value: statusFilter,
              options: [
                { value: "all", label: "Tất cả" },
                { value: "instock", label: "Còn hàng" },
                { value: "outofstock", label: "Hết hàng" }
              ],
              onChange: handleStatusChange,
              minWidth: 160
            }
          ]}

          onResetData={handleResetData}
        />
        <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={() => { /* TODO: Implement sorting */ }}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <TableCell component="th" id={labelId} scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={row.photo}
                              alt={row.photo}
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                }
                              }}
                              onClick={() => {
                                setSelectedImage(row.photo);
                                setSelectedImageTitle(row.title);
                                setImageDialogOpen(true);
                              }}
                            />
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="h6" fontWeight="600">
                                {row.title}
                              </Typography>
                              <Typography color="textSecondary" variant="body2" fontWeight="400">
                                {Array.isArray(row.category) ? row.category.join(', ') : row.category}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography color="textSecondary" variant="body2" fontWeight="400">
                            {format(new Date(row.created), 'E, MMM d')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            sx={{
                              bgcolor: row.stock ? 'success.light' : 'error.light',
                              color: row.stock ? 'success.main' : 'error.main',
                              borderRadius: '8px',
                            }}
                            size="small"
                            label={row.stock ? 'Còn hàng' : 'Hết hàng'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">{row.price}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6" color="success.main" fontWeight="600">
                            {row.salesPrice || row.price}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Chỉnh sửa">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                  setProductToEdit(row);
                                  setEditProduct({
                                    title: row.title,
                                    price: row.price.toString(),
                                    description: row.description || '',
                                    category: Array.isArray(row.category) ? row.category[0] : row.category || '',
                                    stock: row.stock,
                                    photo: row.photo || '',
                                    qty: (row.qty || 1).toString(),
                                    salesPrice: (row.salesPrice || row.price).toString()
                                  });
                                  setEditFormErrors({});
                                  setEditPreviewUrl(row.photo || '');
                                  setEditSelectedFile(null);
                                  setEditDialogOpen(true);
                                }}
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                  }
                                }}
                              >
                                <IconEdit size="1.1rem" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setProductToDelete(row);
                                  setDeleteDialogOpen(true);
                                }}
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.08)'
                                  }
                                }}
                              >
                                <IconTrash size="1.1rem" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
        <Box ml={2}>
          <FormControlLabel
            control={<CustomSwitch checked={dense} onChange={(event: any) => setDense(event.target.checked)} />}
            label="Thu gọn khoảng cách"
          />
        </Box>
      </Box>

      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              error={!!formErrors.title}
              helperText={formErrors.title}
              required
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Giá"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                error={!!formErrors.price}
                helperText={formErrors.price}
                required
              />
              <TextField
                fullWidth
                label="Số lượng"
                type="number"
                value={newProduct.qty}
                onChange={(e) => setNewProduct({ ...newProduct, qty: e.target.value })}
                error={!!formErrors.qty}
                helperText={formErrors.qty}
                inputProps={{ min: 1 }}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Giá đã bán"
                type="number"
                value={newProduct.salesPrice}
                onChange={(e) => setNewProduct({ ...newProduct, salesPrice: e.target.value })}
                error={!!formErrors.salesPrice}
                helperText={formErrors.salesPrice}
                placeholder="Để trống sẽ dùng giá gốc"
              />
              <FormControl fullWidth error={!!formErrors.category}>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={newProduct.category}
                  label="Danh mục"
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <MenuItem value="Electronics">Điện tử</MenuItem>
                  <MenuItem value="Clothing">Thời trang</MenuItem>
                  <MenuItem value="Books">Sách</MenuItem>
                  <MenuItem value="Home">Gia dụng</MenuItem>
                  <MenuItem value="Sports">Thể thao</MenuItem>
                </Select>
                {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Mô tả"
              multiline
              rows={3}
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />

            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Hình ảnh sản phẩm
                </Typography>

                {/* File Upload Button */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<IconUpload size="1.1rem" />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Chọn hình ảnh
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageFileChange}
                    />
                  </Button>

                  {selectedFile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {selectedFile.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={handleClearFile}
                        color="error"
                      >
                        <IconX size="1rem" />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Preview Image */}
                {previewUrl && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Xem trước:
                    </Typography>
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Preview"
                      sx={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                  </Box>
                )}

                {/* URL Input as alternative */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Hoặc nhập URL hình ảnh:
                </Typography>
                <TextField
                  fullWidth
                  label="URL hình ảnh"
                  value={newProduct.photo}
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, photo: e.target.value });
                    setPreviewUrl(e.target.value);
                    setSelectedFile(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                  size="small"
                />
              </Box>
            </Box>

            <FormControlLabel
              control={
                <CustomSwitch
                  checked={newProduct.stock}
                  onChange={(e: any) => setNewProduct({ ...newProduct, stock: e.target.checked })}
                />
              }
              label="Còn hàng"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAddDialogOpen(false);
            setNewProduct({
              title: '',
              price: '',
              description: '',
              category: '',
              stock: true,
              photo: '',
              qty: '1',
              salesPrice: ''
            });
            setFormErrors({});
            setSelectedFile(null);
            setPreviewUrl('');
          }}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              // Validate form
              const errors: any = {};
              if (!newProduct.title.trim()) errors.title = 'Tên sản phẩm là bắt buộc';
              if (!newProduct.price || parseFloat(newProduct.price) <= 0) errors.price = 'Giá phải lớn hơn 0';
              if (!newProduct.qty || parseInt(newProduct.qty) <= 0) errors.qty = 'Số lượng phải lớn hơn 0';
              if (!newProduct.category) errors.category = 'Danh mục là bắt buộc';
              if (newProduct.salesPrice && parseFloat(newProduct.salesPrice) <= 0) errors.salesPrice = 'Giá đã bán phải lớn hơn 0';

              if (Object.keys(errors).length > 0) {
                setFormErrors(errors);

                return;
              }

              try {
                const productToAdd = {
                  title: newProduct.title,
                  price: parseFloat(newProduct.price),
                  description: newProduct.description,
                  category: [newProduct.category],
                  stock: newProduct.stock,
                  photo: newProduct.photo || '/static/images/products/default-product.jpg',
                  salesPrice: newProduct.salesPrice ? parseFloat(newProduct.salesPrice) : parseFloat(newProduct.price),
                  gender: 'All',
                  rating: 0,
                  discount: 0,
                  related: false,
                  qty: parseInt(newProduct.qty),
                  colors: ['#1890FF'],
                  created: new Date()
                };

                ProductService.addProduct(productToAdd);
                loadProducts();
                setAddDialogOpen(false);
                setSnackbarMessage('Thêm sản phẩm mới thành công!');
                setSnackbarOpen(true);
                setNewProduct({
                  title: '',
                  price: '',
                  description: '',
                  category: '',
                  stock: true,
                  photo: '',
                  qty: '1',
                  salesPrice: ''
                });
                setFormErrors({});
                setSelectedFile(null);
                setPreviewUrl('');
              } catch (error) {
                console.error('Lỗi khi thêm sản phẩm:', error);
                setSnackbarMessage('Có lỗi xảy ra khi thêm sản phẩm!');
                setSnackbarOpen(true);
              }
            }}
            variant="contained"
            color="primary"
          >
            Thêm sản phẩm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              value={editProduct.title}
              onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
              error={!!editFormErrors.title}
              helperText={editFormErrors.title}
              required
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Giá"
                type="number"
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                error={!!editFormErrors.price}
                helperText={editFormErrors.price}
                required
              />
              <TextField
                fullWidth
                label="Số lượng"
                type="number"
                value={editProduct.qty}
                onChange={(e) => setEditProduct({ ...editProduct, qty: e.target.value })}
                error={!!editFormErrors.qty}
                helperText={editFormErrors.qty}
                inputProps={{ min: 1 }}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Giá đã bán"
                type="number"
                value={editProduct.salesPrice}
                onChange={(e) => setEditProduct({ ...editProduct, salesPrice: e.target.value })}
                error={!!editFormErrors.salesPrice}
                helperText={editFormErrors.salesPrice}
                placeholder="Để trống sẽ dùng giá gốc"
              />
              <FormControl fullWidth error={!!editFormErrors.category}>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={editProduct.category}
                  label="Danh mục"
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                >
                  <MenuItem value="Electronics">Điện tử</MenuItem>
                  <MenuItem value="Clothing">Thời trang</MenuItem>
                  <MenuItem value="Books">Sách</MenuItem>
                  <MenuItem value="Home">Gia dụng</MenuItem>
                  <MenuItem value="Sports">Thể thao</MenuItem>
                </Select>
                {editFormErrors.category && <FormHelperText>{editFormErrors.category}</FormHelperText>}
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Mô tả"
              multiline
              rows={3}
              value={editProduct.description}
              onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
              error={!!editFormErrors.description}
              helperText={editFormErrors.description}
            />

            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Hình ảnh sản phẩm
                </Typography>

                {/* File Upload Button */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<IconUpload size="1.1rem" />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Chọn hình ảnh mới
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleEditFileChange}
                    />
                  </Button>

                  {editSelectedFile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {editSelectedFile.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={handleClearEditFile}
                        color="error"
                      >
                        <IconX size="1rem" />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Preview Image */}
                {editPreviewUrl && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Xem trước:
                    </Typography>
                    <Box
                      component="img"
                      src={editPreviewUrl}
                      alt="Preview"
                      sx={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                  </Box>
                )}

                {/* URL Input as alternative */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Hoặc nhập URL hình ảnh:
                </Typography>
                <TextField
                  fullWidth
                  label="URL hình ảnh"
                  value={editProduct.photo}
                  onChange={(e) => {
                    setEditProduct({ ...editProduct, photo: e.target.value });
                    setEditPreviewUrl(e.target.value);
                    setEditSelectedFile(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                  size="small"
                />
              </Box>
            </Box>

            <FormControlLabel
              control={
                <CustomSwitch
                  checked={editProduct.stock}
                  onChange={(e: any) => setEditProduct({ ...editProduct, stock: e.target.checked })}
                />
              }
              label="Còn hàng"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false);
            setEditFormErrors({});
            setEditSelectedFile(null);
            setEditPreviewUrl('');
          }}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              // Validate form
              const errors: any = {};
              if (!editProduct.title.trim()) errors.title = 'Tên sản phẩm là bắt buộc';
              if (!editProduct.price || parseFloat(editProduct.price) <= 0) errors.price = 'Giá phải lớn hơn 0';
              if (!editProduct.qty || parseInt(editProduct.qty) <= 0) errors.qty = 'Số lượng phải lớn hơn 0';
              if (!editProduct.category) errors.category = 'Danh mục là bắt buộc';
              if (editProduct.salesPrice && parseFloat(editProduct.salesPrice) <= 0) errors.salesPrice = 'Giá đã bán phải lớn hơn 0';

              if (Object.keys(errors).length > 0) {
                setEditFormErrors(errors);

                return;
              }

              try {
                const updatedProduct = {
                  ...productToEdit,
                  title: editProduct.title,
                  price: parseFloat(editProduct.price),
                  description: editProduct.description,
                  category: [editProduct.category],
                  stock: editProduct.stock,
                  photo: editProduct.photo || productToEdit.photo,
                  qty: parseInt(editProduct.qty),
                  salesPrice: editProduct.salesPrice ? parseFloat(editProduct.salesPrice) : parseFloat(editProduct.price)
                };

                ProductService.updateProduct(productToEdit.id, updatedProduct);
                loadProducts();
                setEditDialogOpen(false);
                setSnackbarMessage('Cập nhật sản phẩm thành công!');
                setSnackbarOpen(true);
                setEditFormErrors({});
              } catch (error) {
                console.error('Lỗi khi cập nhật sản phẩm:', error);
                setSnackbarMessage('Có lỗi xảy ra khi cập nhật sản phẩm!');
                setSnackbarOpen(true);
              }
            }}
            variant="contained"
            color="primary"
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.title}"? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={() => {
              if (productToDelete) {
                ProductService.deleteProduct(productToDelete.id);
                loadProducts();
                setDeleteDialogOpen(false);
                setSnackbarMessage('Đã xóa sản phẩm thành công!');
                setSnackbarOpen(true);
              }
            }}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            maxHeight: '90vh',
            maxWidth: '500px',
            width: '100%'
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)'
          }
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            pb: 1,
            pt: 2,
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          {selectedImageTitle}
        </DialogTitle>
        <DialogContent
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            maxHeight: '70vh',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Box
              component="img"
              src={selectedImage}
              alt={selectedImageTitle}
              sx={{
                maxWidth: '450px',
                maxHeight: '450px',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: 1,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease-in-out',
                cursor: 'zoom-in',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }
              }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();

                // Optional: Add zoom functionality here
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.default'
          }}
        >
          <Button
            onClick={() => setImageDialogOpen(false)}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>



      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductTableList;
