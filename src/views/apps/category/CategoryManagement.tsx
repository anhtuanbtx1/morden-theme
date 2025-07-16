import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CategoryTable from 'src/components/apps/category/CategoryTable';

const BCrumb = [
  {
    to: '/',
    title: 'Trang chủ',
  },
  {
    title: 'Quản lý danh mục',
  },
];

const CategoryManagement = () => {
  return (
    <PageContainer title="Quản lý danh mục" description="Trang quản lý danh mục sản phẩm">
      {/* breadcrumb */}
      <Breadcrumb title="Quản lý danh mục" items={BCrumb} />
      
      {/* Main content */}
      <CategoryTable />
    </PageContainer>
  );
};

export default CategoryManagement;
