import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import {  Typography, Box, Chip } from '@mui/material';
import { Props } from 'react-apexcharts';

import DashboardCard from '../../shared/DashboardCard';
import ProductService from 'src/services/ProductService';

const ProductsSold = () => {
  // chart color
  const theme = useTheme();
  const success = theme.palette.success.main;
  const successlight = theme.palette.success.light;

  // State để lưu thống kê sản phẩm
  const [productStats, setProductStats] = React.useState({
    total: 0,
    inStock: 0,
    outOfStock: 0
  });

  // Load thống kê sản phẩm
  React.useEffect(() => {
    const loadProductStats = () => {
      const allProducts = ProductService.getVisibleProducts();
      const inStockProducts = allProducts.filter(product => product.stock === true);
      const outOfStockProducts = allProducts.filter(product => product.stock === false);

      setProductStats({
        total: allProducts.length,
        inStock: inStockProducts.length,
        outOfStock: outOfStockProducts.length
      });
    };

    loadProductStats();

    // Refresh stats every 5 seconds to catch any updates
    const interval = setInterval(loadProductStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // chart
  const optionscolumnchart: Props = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 85,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [successlight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: {
        show: false,
      },
    },
  };
  // Tạo dữ liệu chart dựa trên thống kê thực tế
  const seriescolumnchart = [
    {
      name: 'Sản phẩm',
      color: success,
      data: [
        productStats.total * 0.8,
        productStats.total * 0.6,
        productStats.total * 0.9,
        productStats.total * 0.7,
        productStats.total * 0.85,
        productStats.total
      ],
    },
  ];

  return (
    <DashboardCard
      footer={
        <>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="area"
            height="85px"
          />
        </>
      }
    >
      <>
        <Typography variant="subtitle2" color="textSecondary">
          Tổng số sản phẩm
        </Typography>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {productStats.total.toLocaleString()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`Còn hàng: ${productStats.inStock}`}
            size="small"
            sx={{
              bgcolor: 'success.light',
              color: 'success.main',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
          <Chip
            label={`Hết hàng: ${productStats.outOfStock}`}
            size="small"
            sx={{
              bgcolor: 'error.light',
              color: 'error.main',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
        </Box>

      </>
    </DashboardCard>
  );
};

export default ProductsSold;
