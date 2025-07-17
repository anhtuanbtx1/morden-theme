import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Skeleton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'src/store/Store';
import {
  fetchCategories,
  removeCategory,
  searchCategories,
  filterCategoriesByStatus,
  resetCategoryData
} from 'src/store/apps/category/CategorySlice';
import {
  IconEdit,
  IconTrash
} from '@tabler/icons';
import { CategoryType } from 'src/types/apps/category';
import { getCategoryColorScheme } from 'src/types/apps/category';
import BlankCard from '../../shared/BlankCard';
import EnhancedTableToolbar from '../../shared/EnhancedTableToolbar';
import { AppState } from 'src/store/Store';
import CategoryDialog from './CategoryDialog';



const CategoryTable = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);

  // Get data from Redux store
  const { categories, loading } = useSelector((state: AppState) => state.categoryReducer);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    setPage(0);
    dispatch(searchCategories(value));
  };

  // Handle status filter
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(0);
    dispatch(filterCategoriesByStatus(status));
  };

  // Handle reset data
  const handleResetData = () => {
    setSearch('');
    setStatusFilter('all');
    setPage(0);
    dispatch(resetCategoryData());
    showSnackbar('Đã reset về dữ liệu ban đầu', 'success');
  };

  // Handle delete
  const handleDeleteClick = (category: CategoryType) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await dispatch(removeCategory(Number(categoryToDelete.id)));
        showSnackbar('Xóa danh mục thành công!', 'success');
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      } catch (error) {
        showSnackbar('Lỗi khi xóa danh mục', 'error');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Show snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle add category
  const handleAddClick = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  // Handle edit category
  const handleEditClick = (category: CategoryType) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingCategory(null);
  };

  // Handle dialog success
  const handleDialogSuccess = (message: string) => {
    showSnackbar(message, 'success');
    dispatch(fetchCategories()); // Refresh the list
  };

  // Handle dialog error
  const handleDialogError = (message: string) => {
    showSnackbar(message, 'error');
  };

  return (
    <BlankCard>
      {/* Toolbar */}
      <EnhancedTableToolbar
        title="Danh sách danh mục"
        search={search}
        onSearchChange={handleSearch}
        searchPlaceholder="Tìm kiếm danh mục..."
        onAddClick={handleAddClick}
        addButtonText="Thêm mới"
        filters={[
          {
            label: "Trạng thái",
            value: statusFilter,
            options: [
              { value: "all", label: "Tất cả" },
              { value: "active", label: "Hoạt động" },
              { value: "inactive", label: "Không hoạt động" }
            ],
            onChange: handleStatusChange,
            minWidth: 120
          }
        ]}
        onResetData={handleResetData}
      />

      {/* Table */}
      <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Mã danh mục</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Tên danh mục</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Mô tả</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Trạng thái</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Ngày tạo</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Hành động</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (

                // Loading skeleton
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from(new Array(6)).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" width="100%" height={40} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : categories && categories.length > 0 ? (
                categories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category: CategoryType) => (
                    <TableRow hover tabIndex={-1} key={category.id}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="600">
                          {category.categoryCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Chip
                            label={category.categoryName}
                            size="small"
                            sx={{
                              backgroundColor: getCategoryColorScheme(category.color).backgroundColor,
                              color: getCategoryColorScheme(category.color).textColor,
                              fontWeight: 500,
                              mr: 1
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300 }}>
                          {category.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          size="small"
                          color={category.status === 'active' ? 'success' : 'default'}
                          variant={category.status === 'active' ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(category.createdAt), 'dd/MM/yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditClick(category)}
                              sx={{
                                width: 32,
                                height: 32,
                                '&:hover': {
                                  backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                }
                              }}
                            >
                              <IconEdit width={16} height={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(category)}
                              sx={{
                                width: 32,
                                height: 32,
                                '&:hover': {
                                  backgroundColor: 'rgba(211, 47, 47, 0.08)'
                                }
                              }}
                            >
                              <IconTrash width={16} height={16} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 3 }}>
                      Không có dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={categories?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa danh mục
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.categoryName}"?
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleDeleteCancel}
            color="primary"
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
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            size="medium"
            sx={{
              minWidth: 80,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Add/Edit Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        category={editingCategory}
        onSuccess={handleDialogSuccess}
        onError={handleDialogError}
      />
    </BlankCard>
  );
};

export default CategoryTable;
