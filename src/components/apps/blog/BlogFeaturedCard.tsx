import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'src/store/Store';
import {
  CardContent,
  Stack,
  Typography,
  Chip,
  Grid,
  Box,
  alpha,
  styled,
  Skeleton
} from '@mui/material';
import { IconEye, IconMessage2, IconPoint } from '@tabler/icons';
import { format } from 'date-fns';
import { fetchBlogPost } from 'src/store/apps/blog/BlogSlice';
import BlankCard from '../../shared/BlankCard';
import CustomCardMedia from '../../shared/CustomCardMedia';
import { BlogPostType } from 'src/types/apps/blog';
import { getCategoryColorScheme } from 'src/types/apps/blog/CategoryEnum';

const CoverImgStyle = styled(CardContent)({
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: 2,
  width: '100%',
  height: '100%',
  color: 'white',
});

const CoverBox = styled(Box)({
  top: 0,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
  zIndex: 1,
});

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

// Removed StyledImg as we'll use CustomCardMedia instead

interface Btype {
  post: BlogPostType;
  index: number;
}

const BlogFeaturedCard = ({ post, index }: Btype) => {
  const dispatch = useDispatch();
  const { coverImg, title, view, comments, category, createdAt }: any = post;
  const linkTo = title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
  const mainPost = index === 0;

  const CoverImgBg = styled(BlankCard)({
    p: 0,
    height: 'auto',
    minHeight: '300px',
    maxHeight: mainPost ? '600px' : '400px',
    position: 'relative',
    aspectRatio: '16/9',
    width: '100%',
    overflow: 'hidden',
  });

  // skeleton
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {post ? (
        <Grid
          item
          xs={12}
          lg={mainPost ? 8 : 4}
          md={12}
          sm={12}
          display="flex"
          alignItems="stretch"
        >
          {isLoading ? (
            <>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="100%"
                height={400}
                sx={{ borderRadius: (theme) => theme.shape.borderRadius / 5 }}
              ></Skeleton>
            </>
          ) : (
            <CoverImgBg className="hoverCard">
              <ImageContainer>
                <Link
                  to={`/apps/blog/detail/${linkTo}`}
                  onClick={() => dispatch(fetchBlogPost(linkTo))}
                  style={{ display: 'block', width: '100%', height: '100%' }}
                >
                  <CustomCardMedia
                    src={coverImg}
                    alt={title || "Featured blog image"}
                  />
                  <CoverBox
                    sx={{ backgroundColor: (theme) => alpha(theme.palette.grey[900], 0.6) }}
                  />
                </Link>
                <CoverImgStyle>
                  <Box
                    height={'100%'}
                    display={'flex'}
                    justifyContent="space-between"
                    flexDirection="column"
                  >
                    <Box>
                      <Stack direction="row">
                        <Chip
                          sx={{ marginLeft: 'auto' }}
                          label="2 min Read"
                          size="small"
                        ></Chip>
                      </Stack>
                    </Box>
                    <Box>
                      <Box my={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography
                          gutterBottom
                          variant="h3"
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
                        <Stack direction="row" justifyContent="center" mt={1} mb={2}>
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
                    </Box>
                  </Box>
                </CoverImgStyle>
              </ImageContainer>
            </CoverImgBg>
          )}
        </Grid>
      ) : (
        ''
      )}
    </>
  );
};

export default BlogFeaturedCard;
