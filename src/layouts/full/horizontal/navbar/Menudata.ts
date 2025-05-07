import {
  IconHome,
  IconPoint,
  IconMessage2,
  IconList
} from '@tabler/icons';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome,
    href: '/dashboards/',
    children: [
      {
        id: uniqueId(),
        title: 'Modern',
        icon: IconPoint,
        href: '/dashboards/modern',
        chip: 'New',
        chipColor: 'secondary',
      },
      {
        id: uniqueId(),
        title: 'eCommerce',
        icon: IconPoint,
        href: '/dashboards/ecommerce',
      },
    ],
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
