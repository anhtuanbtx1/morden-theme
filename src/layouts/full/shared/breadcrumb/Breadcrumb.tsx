import React from 'react';

interface BreadCrumbType {
  items?: any[];
  title?: string;
  subtitle?: string;
  children?: JSX.Element;
}

const Breadcrumb = ({}: BreadCrumbType) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      backgroundColor: 'transparent',
      borderRadius: '8px',
      padding: '30px 25px 20px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
      width: '100%'
    }}>
      <div style={{
        display: windowWidth >= 1200 ? 'flex' : (windowWidth >= 768 ? 'block' : 'none'),
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
      }}>
       
      </div>
    </div>
  );
};

export default Breadcrumb;
