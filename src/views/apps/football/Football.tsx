
import React, { useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import FootballListing from 'src/components/apps/football/FootballListing';
import { Box, TextField, InputAdornment, Button, Grid } from '@mui/material';
import { IconSearch } from '@tabler/icons';

const Football = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Xử lý tìm kiếm
    console.log('Searching for:', searchTerm);
    if (window.handleFootballSearch && typeof window.handleFootballSearch === 'function') {
      window.handleFootballSearch(searchTerm);
    }
  };

  return (
    <PageContainer title="Bóng Đá" description="">
      {/* Thanh công cụ tìm kiếm */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 3,
            backgroundColor: 'background.paper',
            boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)'
            }
          }}>
            <TextField
              placeholder="Tìm kiếm..."
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="18" color="#1976d2" />
                  </InputAdornment>
                ),
                sx: {
                  height: '40px',
                  borderRadius: 2,
                  fontSize: '0.875rem',
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
                }
              }}
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              size="small"
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                height: '40px',
                minWidth: '100px',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'none',
                boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Tìm kiếm
            </Button>
          </Box>
        </Grid>
      </Grid>

      <FootballListing />
    </PageContainer>
  );
};

export default Football;
