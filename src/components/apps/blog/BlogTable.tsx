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
  Avatar,
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
  DialogTitle
} from '@mui/material';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'src/store/Store';
import { fetchBlogPosts } from 'src/store/apps/blog/BlogSlice';
import {
  IconEye,
  IconMessage2,
  IconEdit,
  IconTrash,
  IconPlus
} from '@tabler/icons';
import { BlogPostType } from 'src/types/apps/blog';
import { getCategoryColorScheme } from 'src/types/apps/blog/CategoryEnum';
import BlankCard from '../../shared/BlankCard';
import { AppState } from 'src/store/Store';
import { Link } from 'react-router-dom';

const BlogTable = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State cho dialog xóa
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  // Lấy dữ liệu blog từ Redux store
  const blogPosts = useSelector((state: AppState) => state.blogReducer.blogposts);

  // State để kiểm soát loading
  const [isLoading, setLoading] = useState(true);

  // Fetch dữ liệu blog khi component được mount
  useEffect(() => {
    try {
      dispatch(fetchBlogPosts());
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu blog:', error);
    } finally {
      // Đảm bảo loading được tắt sau một khoảng thời gian, ngay cả khi có lỗi
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [dispatch]);

  // Xử lý mở dialog xóa
  const handleOpenDeleteDialog = (id: number) => {
    setPostToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Xử lý đóng dialog xóa
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPostToDelete(null);
  };

  // Xử lý xóa bài viết
  const handleDeletePost = () => {
    // Ở đây sẽ gọi API để xóa bài viết
    console.log('Xóa bài viết có ID:', postToDelete);

    // Đóng dialog
    handleCloseDeleteDialog();

    // Reload dữ liệu sau khi xóa
    dispatch(fetchBlogPosts());
  };

  // Xử lý thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số hàng mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Tạo link từ tiêu đề bài viết
  const createLinkFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };

  return (
    <BlankCard>
      {isLoading ? (

        // Hiển thị skeleton loading khi đang tải dữ liệu
        <Box p={3}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Skeleton
              key={item}
              variant="rectangular"
              width="100%"
              height={60}
              sx={{ mb: 2, borderRadius: 1 }}
            />
          ))}
        </Box>
      ) : (
        <>
          {/* Các nút hành động */}
          <Box p={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              to="/apps/blog/gallery"
            >
              Thư viện hình ảnh
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconPlus width={18} height={18} />}
              component={Link}
              to="/apps/blog/create"
            >
              Thêm mới
            </Button>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Bài viết</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Danh mục</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Ngày tạo</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Lượt xem</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Bình luận</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Tác giả</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Hành động</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blogPosts && blogPosts.length > 0 ? (
                  blogPosts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((post: BlogPostType) => {
                      const linkTo = createLinkFromTitle(post.title || '');

                      return (
                        <TableRow hover tabIndex={-1} key={post.id}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar
                                src={post.coverImg}
                                alt={post.title}
                                sx={{ width: 56, height: 56, borderRadius: '10%' }}
                              />
                              <Box sx={{ ml: 2 }}>
                                <Typography variant="h6" fontWeight="600">
                                  {post.title}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={post.category}
                              size="small"
                              sx={{
                                backgroundColor: getCategoryColorScheme(post.category || '').backgroundColor,
                                color: getCategoryColorScheme(post.category || '').textColor,
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {post.createdAt ?
                                (() => {
                                  try {

                                    return format(new Date(post.createdAt), 'dd/MM/yyyy');
                                  } catch (error) {
                                    console.error('Lỗi định dạng ngày tháng:', error);

                                    return 'Không xác định';
                                  }
                                })()
                                : 'Không xác định'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" gap={1} alignItems="center">
                              <IconEye width={18} height={18} /> {post.view}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" gap={1} alignItems="center">
                              <IconMessage2 width={18} height={18} /> {post.comments?.length || 0}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar
                                src={post.author?.avatar}
                                alt={post.author?.name}
                                sx={{ width: 35, height: 35 }}
                              />
                              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                                {post.author?.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Xem chi tiết">
                                <IconButton
                                  color="primary"
                                  component={Link}
                                  to={`/apps/blog/detail/${linkTo}`}
                                >
                                  <IconEye width={18} height={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Chỉnh sửa">
                                <IconButton
                                  color="secondary"
                                  component={Link}
                                  to={`/apps/blog/edit/${post.id}`}
                                >
                                  <IconEdit width={18} height={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <IconButton
                                  color="error"
                                  onClick={() => handleOpenDeleteDialog(post.id || 0)}
                                >
                                  <IconTrash width={18} height={18} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box py={3}>
                        <Typography variant="h6" gutterBottom>Không có dữ liệu</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Không tìm thấy bài viết nào. Hãy thêm bài viết mới bằng nút "Thêm mới" ở trên.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Dialog xác nhận xóa */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Xác nhận xóa bài viết"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="primary">
                Hủy
              </Button>
              <Button onClick={handleDeletePost} color="error" autoFocus>
                Xóa
              </Button>
            </DialogActions>
          </Dialog>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={blogPosts ? blogPosts.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          />
        </>
      )}
    </BlankCard>
  );
};

export default BlogTable;
