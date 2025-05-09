import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import FootballListing from 'src/components/apps/football/FootballListing';

const Football = () => {
  return (
    <PageContainer title="Bóng Đá" description="Trang Bóng Đá">
      <Breadcrumb title="Bóng Đá" subtitle="Tin tức bóng đá mới nhất" />
      <FootballListing />
    </PageContainer>
  );
};

export default Football;
