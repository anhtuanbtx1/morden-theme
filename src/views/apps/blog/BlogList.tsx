import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import BlogTable from 'src/components/apps/blog/BlogTable';

const BlogList = () => {
  return (
    <PageContainer title="Danh sách Blog" description="Hiển thị danh sách blog dưới dạng bảng">
      <Breadcrumb title="Danh sách Blog" subtitle="Xem tất cả bài viết" />
      <BlogTable />
    </PageContainer>
  );
};

export default BlogList;
