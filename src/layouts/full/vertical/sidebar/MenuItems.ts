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
  IconAperture,
  IconMessage2,
  IconList
} from '@tabler/icons';

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Modern',
    icon: IconAperture,
    href: '/dashboards/modern',
    chip: 'New',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'eCommerce',
    icon: IconShoppingCart,
    href: '/dashboards/ecommerce',
  },

  {
    navlabel: true,
    subheader: 'Blog',
  },
  {
    id: uniqueId(),
    title: 'Blog',
    icon: IconMessage2,
    href: '/apps/blog/posts',
  },
  {
    id: uniqueId(),
    title: 'Danh sách',
    icon: IconList,
    href: '/apps/blog/list',
  },
];

export default Menuitems;
