import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

import DashboardCard from '../../shared/DashboardCard';
import ProductService from 'src/services/ProductService';
import { Props } from 'react-apexcharts';

const TotalEarning = () => {
  // chart color
  const theme = useTheme();
  const errorColor = theme.palette.error.main;

  // State để lưu tổng giá trị sản phẩm hết hàng
  const [outOfStockValue, setOutOfStockValue] = React.useState(0);

  // Load thống kê giá trị sản phẩm hết hàng
  React.useEffect(() => {
    const loadOutOfStockStats = () => {
      const allProducts = ProductService.getVisibleProducts();
      const outOfStockProducts = allProducts.filter(product => product.stock === false);

      // Tính tổng giá trị (price * qty) của sản phẩm hết hàng
      const totalValue = outOfStockProducts.reduce((sum, product) => {
        return sum + (product.price * product.qty);
      }, 0);

      setOutOfStockValue(totalValue);
    };

    loadOutOfStockStats();

    // Refresh stats every 5 seconds to catch any updates
    const interval = setInterval(loadOutOfStockStats, 5000);

    return () => clearInterval(interval);
  }, []);

  // Format số tiền theo định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // chart
  const optionscolumnchart: Props = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 55,
      resize: true,
      barColor: '#fff',
      sparkline: {
        enabled: true,
      },
    },
    colors: [errorColor],
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        startingShape: 'flat',
        endingShape: 'flat',
        columnWidth: '60%',
        barHeight: '20%',
        borderRadius: 3,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2.5,
      colors: ['rgba(0,0,0,0.01)'],
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    axisBorder: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: {
        show: false,
      },
    },
  };

  // Tạo dữ liệu chart dựa trên giá trị sản phẩm hết hàng
  const seriescolumnchart = [
    {
      name: 'Giá trị hết hàng',
      data: [
        outOfStockValue * 0.7,
        outOfStockValue * 0.9,
        outOfStockValue * 0.6,
        outOfStockValue * 0.8,
        outOfStockValue * 1.1,
        outOfStockValue * 0.9,
        outOfStockValue * 1.2,
        outOfStockValue * 0.8,
        outOfStockValue
      ],
    },
  ];

  return (
    <DashboardCard>
      <>
        <Typography variant="subtitle2" color="textSecondary">
          Giá trị hàng hết
        </Typography>
        <Typography variant="h4" color="error.main">
          {formatCurrency(outOfStockValue)}
        </Typography>
        <Box mt={5}>
          <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height="55px" />
        </Box>
      </>
    </DashboardCard>
  );
};

export default TotalEarning;
