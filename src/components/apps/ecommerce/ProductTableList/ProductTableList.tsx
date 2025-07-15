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
  Toolbar,
  IconButton,
  Tooltip,
  FormControlLabel,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Snackbar,
  Alert,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { format } from 'date-fns';
import { useDispatch } from 'src/store/Store';
import { fetchProducts } from 'src/store/apps/eCommerce/ECommerceSlice';
import ProductService from 'src/services/ProductService';
import { IconFilter, IconSearch, IconTrash, IconEdit, IconPlus, IconRefresh } from '@tabler/icons';
import CustomSwitch from 'src/components/forms/theme-elements/CustomSwitch';
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

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleSearch: React.ChangeEvent<HTMLInputElement> | any;
  search: string;
  onAddClick: () => void;
  categoryFilter: string[];
  onCategoryChange: (categories: string[]) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  onResetData: () => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, handleSearch, search, onAddClick, categoryFilter, onCategoryChange, statusFilter, onStatusChange, onResetData } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
          {numSelected} đã chọn
        </Typography>
      ) : (
        <Box sx={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="Tìm kiếm sản phẩm"
            size="small"
            onChange={handleSearch}
            value={search}
            sx={{ minWidth: 180 }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              multiple
              value={categoryFilter}
              label="Danh mục"
              onChange={(e) => onCategoryChange(e.target.value as string[])}
              renderValue={(selected) => {
                const categoryNames: { [key: string]: string } = {
                  'Electronics': 'Điện tử',
                  'Clothing': 'Thời trang',
                  'Books': 'Sách',
                  'Home': 'Gia dụng',
                  'Sports': 'Thể thao'
                };

                if (selected.length === 0) {
                  return '';
                } else if (selected.length === 1) {
                  return categoryNames[selected[0]] || selected[0];
                } else if (selected.length === 2) {
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={categoryNames[value] || value} 
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.75rem',
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            color: 'primary.main'
                          }}
                        />
                      ))}
                    </Box>
                  );
                } else {
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Chip 
                        label={categoryNames[selected[0]] || selected[0]} 
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          color: 'primary.main'
                        }}
                      />
                      <Chip 
                        label={`+${selected.length - 1} khác`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          backgroundColor: 'rgba(158, 158, 158, 0.08)',
                          color: 'text.secondary'
                        }}
                      />
                    </Box>
                  );
                }
              }}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0,0,0,0.1)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2
                }
              }}
            >
              <MenuItem value="Electronics">Điện tử</MenuItem>
              <MenuItem value="Clothing">Thời trang</MenuItem>
              <MenuItem value="Books">Sách</MenuItem>
              <MenuItem value="Home">Gia dụng</MenuItem>
              <MenuItem value="Sports">Thể thao</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => onStatusChange(e.target.value)}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0,0,0,0.1)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2
                }
              }}
            >
              <MenuItem value="all">Tất cả trạng thái</MenuItem>
              <MenuItem value="instock">Còn hàng</MenuItem>
              <MenuItem value="outofstock">Hết hàng</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconPlus size="1.1rem" />}
            onClick={onAddClick}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Thêm sản phẩm mới
          </Button>
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xóa">
          <IconButton>
            <IconTrash width="18" />
          </IconButton>
        </Tooltip>
      ) : (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Lọc danh sách">
            <IconButton>
              <IconFilter size="1.2rem" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset về dữ liệu ban đầu">
            <IconButton onClick={onResetData} color="warning">
              <IconRefresh size="1.2rem" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Toolbar>
  );
};

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
    photo: ''
  });
  const [editProduct, setEditProduct] = React.useState({
    title: '',
    price: '',
    description: '',
    category: '',
    stock: true,
    photo: ''
  });
  const [formErrors, setFormErrors] = React.useState<any>({});
  const [editFormErrors, setEditFormErrors] = React.useState<any>({});

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

  return (
    <Box>
      <Box>
        <EnhancedTableToolbar
          numSelected={0}
          search={search}
          handleSearch={(event: any) => handleSearch(event)}
          onAddClick={() => setAddDialogOpen(true)}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
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
                              sx={{ width: 56, height: 56, borderRadius: '10px' }}
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
                          <Typography variant="h6">${row.price}</Typography>
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
                                    photo: row.photo || ''
                                  });
                                  setEditFormErrors({});
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên sản phẩm"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL hình ảnh"
                value={newProduct.photo}
                onChange={(e) => setNewProduct({ ...newProduct, photo: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={newProduct.stock}
                    onChange={(e: any) => setNewProduct({ ...newProduct, stock: e.target.checked })}
                  />
                }
                label="Còn hàng"
              />
            </Grid>
          </Grid>
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
              photo: ''
            });
            setFormErrors({});
          }}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              // Validate form
              const errors: any = {};
              if (!newProduct.title.trim()) errors.title = 'Tên sản phẩm là bắt buộc';
              if (!newProduct.price || parseFloat(newProduct.price) <= 0) errors.price = 'Giá phải lớn hơn 0';
              if (!newProduct.category) errors.category = 'Danh mục là bắt buộc';
              if (!newProduct.description.trim()) errors.description = 'Mô tả là bắt buộc';

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
                  salesPrice: parseFloat(newProduct.price),
                  gender: 'All',
                  rating: 0,
                  discount: 0,
                  related: false,
                  qty: 1,
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
                  photo: ''
                });
                setFormErrors({});
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên sản phẩm"
                value={editProduct.title}
                onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
                error={!!editFormErrors.title}
                helperText={editFormErrors.title}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL hình ảnh"
                value={editProduct.photo}
                onChange={(e) => setEditProduct({ ...editProduct, photo: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={editProduct.stock}
                    onChange={(e: any) => setEditProduct({ ...editProduct, stock: e.target.checked })}
                  />
                }
                label="Còn hàng"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false);
            setEditFormErrors({});
          }}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              // Validate form
              const errors: any = {};
              if (!editProduct.title.trim()) errors.title = 'Tên sản phẩm là bắt buộc';
              if (!editProduct.price || parseFloat(editProduct.price) <= 0) errors.price = 'Giá phải lớn hơn 0';
              if (!editProduct.category) errors.category = 'Danh mục là bắt buộc';
              if (!editProduct.description.trim()) errors.description = 'Mô tả là bắt buộc';

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
                  salesPrice: parseFloat(editProduct.price)
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
