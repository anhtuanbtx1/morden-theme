import React from 'react';
import { Stack, Box, Typography, Tooltip, Fab, TextField, Button } from '@mui/material';
import { IconArrowBackUp, IconCircle } from '@tabler/icons';
import { BlogType } from 'src/types/apps/blog';

const BlogComment = ({ comment }: BlogType | any) => {
  const [showReply, setShowReply] = React.useState(false);

  return (
    <>
      <Box mt={2} p={3} sx={{ backgroundColor: 'grey.100' }}>
        <Stack direction={'row'} gap={2} alignItems="center">
          <Typography variant="h6">{comment?.profile.name}</Typography>
          <Typography variant="caption" color="textSecondary">
            <>
              <IconCircle size="7" fill="" fillOpacity={'0.1'} strokeOpacity="0.1" />{' '}
              {comment?.profile.time}
            </>
          </Typography>
        </Stack>
        <Box py={2}>
          <Typography color="textSecondary">{comment?.comment}</Typography>
        </Box>
        <Stack direction="row" gap={1} alignItems="center">
          <Tooltip title="Reply" placement="top">
            <Fab size="small" color="info" onClick={() => setShowReply(!showReply)}>
              <IconArrowBackUp size="16" />
            </Fab>
          </Tooltip>
        </Stack>
      </Box>
      {comment?.replies ? (
        <>
          {comment?.replies.map((reply: BlogType | any) => {
            return (
              <Box pl={4} key={reply.comment}>
                <Box mt={2} p={3} sx={{ backgroundColor: 'grey.100' }}>
                  <Stack direction={'row'} gap={2} alignItems="center">
                    <Typography variant="h6">{reply.profile.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      <IconCircle size="7" fill="" fillOpacity={'0.1'} strokeOpacity="0.1" />{' '}
                      {reply.profile.time}
                    </Typography>
                  </Stack>
                  <Box py={2}>
                    <Typography color="textSecondary">{reply.comment}</Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </>
      ) : (
        ''
      )}
      {showReply ? (
        <Box p={2}>
          <Stack direction={'row'} gap={2} alignItems="center">
            <TextField placeholder="Reply" variant="outlined" fullWidth />
            <Button variant="contained">Reply</Button>
          </Stack>
        </Box>
      ) : (
        ''
      )}
    </>
  );
};

export default BlogComment;
