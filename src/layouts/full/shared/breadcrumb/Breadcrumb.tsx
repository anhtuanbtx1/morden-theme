import React from 'react';
import { Grid, Box, Theme } from '@mui/material';

import breadcrumbImg from 'src/assets/images/breadcrumb/ChatBc.png';

interface BreadCrumbType {
  items?: any[];
  title?: string;
  subtitle?: string;
  children?: JSX.Element;
}

const Breadcrumb = ({ children }: BreadCrumbType) => {

  return (
  <Grid
    container
    sx={{
      backgroundColor: 'primary.light',
      borderRadius: (theme: Theme) => theme.shape.borderRadius / 4,
      p: '30px 25px 20px',
      marginBottom: '30px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Grid item xs={12} sm={12} lg={12} display="flex" alignItems="flex-end">
      <Box
        sx={{
          display: { xs: 'none', md: 'block', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        {children ? (
          <Box sx={{ top: '0px', position: 'absolute' }}>{children}</Box>
        ) : (
          <>
            <Box sx={{ top: '0px', position: 'absolute' }}>
              <img src={breadcrumbImg} alt={breadcrumbImg} width={'165px'} />
            </Box>
          </>
        )}
      </Box>
    </Grid>
  </Grid>
  );
};

export default Breadcrumb;
