import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import BlogGallery from 'src/components/apps/blog/BlogGallery';

const BlogGalleryPage = () => {
  return (
    <PageContainer title="Thư viện hình ảnh Blog" description="Hiển thị tất cả hình ảnh blog">
      <Breadcrumb title="Thư viện hình ảnh" subtitle="Xem tất cả hình ảnh blog" />
      <BlogGallery />
    </PageContainer>
  );
};

export default BlogGalleryPage;
