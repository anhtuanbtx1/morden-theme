import mock from '../mock';
import { sub } from 'date-fns';
import { Chance } from 'chance';
import s1 from 'src/assets/images/products/s1.jpg';
import s2 from 'src/assets/images/products/s2.jpg';
import s3 from 'src/assets/images/products/s3.jpg';
import s4 from 'src/assets/images/products/s4.jpg';
import s5 from 'src/assets/images/products/s5.jpg';
import s6 from 'src/assets/images/products/s6.jpg';
import s7 from 'src/assets/images/products/s7.jpg';
import s8 from 'src/assets/images/products/s8.jpg';
import s9 from 'src/assets/images/products/s9.jpg';
import s10 from 'src/assets/images/products/s10.jpg';
import s11 from 'src/assets/images/products/s11.jpg';
import s12 from 'src/assets/images/products/s12.jpg';
import productsJsonData from 'src/data/products.json';
import { ProductJsonData } from 'src/types/data/ProductJsonData';

const chance = new Chance();

// Map image filenames to imported images
const imageMap: { [key: string]: string } = {
  's1.jpg': s1,
  's2.jpg': s2,
  's3.jpg': s3,
  's4.jpg': s4,
  's5.jpg': s5,
  's6.jpg': s6,
  's7.jpg': s7,
  's8.jpg': s8,
  's9.jpg': s9,
  's10.jpg': s10,
  's11.jpg': s11,
  's12.jpg': s12,
};

// Transform JSON data to match the original structure
const ProductsData = (productsJsonData as ProductJsonData[]).map((item: ProductJsonData) => ({
  title: item.title,
  price: item.price,
  discount: item.discount,
  related: item.related,
  salesPrice: item.salesPrice,
  category: item.category,
  gender: item.gender,
  rating: item.rating,
  stock: item.stock,
  qty: item.qty,
  colors: item.colors,
  photo: imageMap[item.photo] || s1, // Fallback to s1 if image not found
  id: item.id,
  created: sub(new Date(), {
    days: item.createdDaysAgo,
    hours: item.createdHoursAgo,
    minutes: item.createdMinutesAgo
  }),
  description: chance.paragraph({ sentences: item.descriptionSentences }),
}));

mock.onGet('/api/data/eCommerce/ProductsData').reply(() => {
  return [200, ProductsData];
});

export default ProductsData;
