import React, { useEffect } from 'react';

// third-party
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useDispatch } from 'src/store/Store';
import {
  CardContent,
  Stack,
  Typography,
  Chip,
  Grid,
  Box,
  Skeleton
} from '@mui/material';
import CustomCardMedia from '../../shared/CustomCardMedia';
import { IconEye, IconMessage2, IconPoint } from '@tabler/icons';
import { fetchBlogPost } from 'src/store/apps/blog/BlogSlice';
import BlankCard from '../../shared/BlankCard';
import { BlogPostType } from 'src/types/apps/blog';
import { getCategoryColorScheme } from 'src/types/apps/blog/CategoryEnum';

interface Btype {
  post: BlogPostType;
  index?: number;
}

const BlogCard = ({ post }: Btype) => {
  const dispatch = useDispatch();
  const { coverImg, title, view, comments, category, createdAt }: any = post;
  const linkTo = title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

  // skeleton
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Grid item xs={12} lg={4} md={4} sm={6} display="flex" alignItems="stretch">
      {isLoading ? (
        <>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={400}
            sx={{ borderRadius: (theme) => theme.shape.borderRadius / 5 }}
          ></Skeleton>
        </>
      ) : (
        <BlankCard className="hoverCard">
          <>
            <Typography
              component={Link}
              to={`/apps/blog/detail/${linkTo}`}
              onClick={() => dispatch(fetchBlogPost(linkTo))}
            >
              <CustomCardMedia
                src={coverImg}
                alt={title || "Blog image"}
              />
            </Typography>
            <CardContent sx={{ pt: 2, px: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    textAlign: 'center',
                    width: '100%'
                  }}
                  component={Link}
                  to={`/apps/blog/detail/${linkTo}`}
                  onClick={() => dispatch(fetchBlogPost(linkTo))}
                >
                  {title}
                </Typography>
                <Stack direction="row" justifyContent="center" mt={1}>
                  <Chip
                    label={category}
                    size="small"
                    sx={{
                      backgroundColor: getCategoryColorScheme(category).backgroundColor,
                      color: getCategoryColorScheme(category).textColor,
                      fontWeight: 500
                    }}
                  />
                </Stack>
              </Box>
              <Stack direction="row" gap={3} alignItems="center">
                <Stack direction="row" gap={1} alignItems="center">
                  <IconEye size="18" /> {view}
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  <IconMessage2 size="18" /> {comments?.length}
                </Stack>

                <Stack direction="row" ml="auto" alignItems="center">
                  <IconPoint size="16" />
                  <small>{format(new Date(createdAt), 'E, MMM d')}</small>
                </Stack>
              </Stack>
            </CardContent>
          </>
        </BlankCard>
      )}
    </Grid>
  );
};

export default BlogCard;
