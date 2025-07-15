import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ProductTableList from 'src/components/apps/ecommerce/ProductTableList/ProductTableList';
import BlankCard from 'src/components/shared/BlankCard';

const BCrumb = [
  {
    to: '/',
    title: 'Trang chủ',
  },
  {
    title: 'Cửa hàng',
  },
];

const EcomProductList = () => {
  return (
    <PageContainer title="Danh sách sản phẩm" description="Trang danh sách sản phẩm">
      {/* breadcrumb */}
      <Breadcrumb title="Danh sách sản phẩm" items={BCrumb} />
      <BlankCard>
        {/* ------------------------------------------- */}
        {/* Phần chính */}
        {/* ------------------------------------------- */}
        <ProductTableList />
      </BlankCard>
    </PageContainer>
  );
};

export default EcomProductList;
