import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons';

import DashboardCard from '../../shared/DashboardCard';
import icon1Img from 'src/assets/images/svgs/icon-paypal.svg';
import ProductService from 'src/services/ProductService';

const Payment = () => {
  const theme = useTheme();
  const successlight = theme.palette.success.light;

  // State để lưu tổng giá trị sản phẩm
  const [totalValue, setTotalValue] = React.useState(0);

  // Tính tổng giá trị tất cả sản phẩm
  React.useEffect(() => {
    const calculateTotalValue = () => {
      const allProducts = ProductService.getVisibleProducts();
      const total = allProducts.reduce((sum, product) => {
        return sum + (product.price * product.qty);
      }, 0);
      setTotalValue(total);
    };

    calculateTotalValue();

    // Refresh total every 5 seconds to catch any updates
    const interval = setInterval(calculateTotalValue, 5000);

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

  return (
    <DashboardCard>
      <>
        <Avatar
          variant="rounded"
          sx={{ bgcolor: (theme) => theme.palette.primary.light, width: 40, height: 40 }}
        >
          <Avatar src={icon1Img} alt={icon1Img} sx={{ width: 24, height: 24 }} />
        </Avatar>
        <Typography variant="subtitle2" color="textSecondary" mt={3}>
          Tổng giá trị sản phẩm
        </Typography>
        <Typography variant="h4">{formatCurrency(totalValue)}</Typography>
        <Stack direction="row" spacing={1} mt={1} alignItems="center">
          <Avatar sx={{ bgcolor: successlight, width: 20, height: 20 }}>
            <IconArrowUpLeft width={16} color="#39B69A" />
          </Avatar>
          <Typography variant="subtitle2" color="textSecondary">
            Tất cả sản phẩm
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default Payment;
