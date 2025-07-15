import { uniqueId } from 'lodash';

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}
import {
  IconShoppingCart,
  IconMessage2,
  IconList,
  IconPhoto,
  IconPackage
} from '@tabler/icons';

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'eCommerce',
    icon: IconShoppingCart,
    href: '/dashboards/ecommerce',
  },
  {
    id: uniqueId(),
    title: 'Danh sách sản phẩm',
    icon: IconPackage,
    href: '/apps/ecommerce/eco-product-list',
  },
  {
    navlabel: true,
    subheader: 'Football',
  },
  {
    id: uniqueId(),
    title: 'Bóng Đá',
    icon: IconMessage2,
    href: '/apps/football/posts',
  },
  {
    navlabel: true,
    subheader: 'Blog',
  },
  {
    id: uniqueId(),
    title: 'Lego',
    icon: IconMessage2,
    href: '/apps/blog/posts',
  },
  {
    id: uniqueId(),
    title: 'Danh sách',
    icon: IconList,
    href: '/apps/blog/list',
  },
  {
    id: uniqueId(),
    title: 'Thư viện ảnh',
    icon: IconPhoto,
    href: '/apps/blog/gallery',
  },
];

export default Menuitems;
