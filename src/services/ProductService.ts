import { ProductType } from 'src/types/apps/eCommerce';
import ProductsData from 'src/_mockApis/eCommerce/ProductsData';

const STORAGE_KEY = 'ecommerce_products';

class ProductService {
  // Lấy tất cả sản phẩm (kết hợp mock data + localStorage)
  static getAllProducts(): ProductType[] {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY);
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);

        // Kết hợp mock data với dữ liệu đã lưu
        return [...ProductsData, ...parsedProducts];
      }

      return ProductsData;
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);

      return ProductsData;
    }
  }

  // Thêm sản phẩm mới
  static addProduct(product: Omit<ProductType, 'id'>): ProductType {
    try {
      const existingProducts = this.getStoredProducts();
      const allProducts = this.getAllProducts();
      
      // Tạo ID mới (lớn hơn tất cả ID hiện có)
      const maxId = Math.max(...allProducts.map(p => Number(p.id)), 0);
      const newProduct: ProductType = {
        ...product,
        id: maxId + 1,
        created: new Date(),
        rating: 0,
        discount: 0,
        related: false,
        qty: 1,
        colors: ['#1890FF'],
        gender: 'All'
      };

      // Lưu vào localStorage (chỉ lưu sản phẩm mới, không lưu mock data)
      const updatedStoredProducts = [...existingProducts, newProduct];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStoredProducts));

      return newProduct;
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);

      throw new Error('Không thể thêm sản phẩm');
    }
  }

  // Cập nhật sản phẩm
  static updateProduct(id: number, updatedProduct: Partial<ProductType>): ProductType | null {
    try {
      const storedProducts = this.getStoredProducts();
      const productIndex = storedProducts.findIndex(p => p.id === id);

      if (productIndex !== -1) {
        // Cập nhật sản phẩm trong localStorage
        storedProducts[productIndex] = { ...storedProducts[productIndex], ...updatedProduct };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedProducts));

        return storedProducts[productIndex];
      } else {
        // Kiểm tra xem có phải sản phẩm mock không
        const mockProduct = ProductsData.find(p => p.id === id);
        if (mockProduct) {
          // Tạo bản sao của mock product và lưu vào localStorage
          const newProduct = { ...mockProduct, ...updatedProduct };
          storedProducts.push(newProduct);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(storedProducts));

          return newProduct;
        }
      }

      return null;
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);

      throw new Error('Không thể cập nhật sản phẩm');
    }
  }

  // Xóa sản phẩm
  static deleteProduct(id: number): boolean {
    try {
      const storedProducts = this.getStoredProducts();
      const filteredProducts = storedProducts.filter(p => p.id !== id);
      
      if (filteredProducts.length !== storedProducts.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));

        return true;
      }

      // Không thể xóa sản phẩm mock (chỉ có thể ẩn)
      const mockProduct = ProductsData.find(p => p.id === id);
      if (mockProduct) {
        // Đánh dấu sản phẩm mock là đã xóa
        const hiddenProducts = this.getHiddenProducts();
        hiddenProducts.push(id);
        localStorage.setItem('hidden_products', JSON.stringify(hiddenProducts));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);

      throw new Error('Không thể xóa sản phẩm');
    }
  }

  // Lấy sản phẩm theo ID
  static getProductById(id: number): ProductType | null {
    const allProducts = this.getAllProducts();

    return allProducts.find(p => p.id === id) || null;
  }

  // Lấy chỉ sản phẩm đã lưu trong localStorage
  private static getStoredProducts(): ProductType[] {
    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY);

      return storedProducts ? JSON.parse(storedProducts) : [];
    } catch (error) {
      console.error('Lỗi khi đọc sản phẩm đã lưu:', error);

      return [];
    }
  }

  // Lấy danh sách sản phẩm đã ẩn
  private static getHiddenProducts(): number[] {
    try {
      const hiddenProducts = localStorage.getItem('hidden_products');

      return hiddenProducts ? JSON.parse(hiddenProducts) : [];
    } catch (error) {
      console.error('Lỗi khi đọc sản phẩm đã ẩn:', error);

      return [];
    }
  }

  // Lấy tất cả sản phẩm (loại trừ sản phẩm đã ẩn)
  static getVisibleProducts(): ProductType[] {
    const allProducts = this.getAllProducts();
    const hiddenProducts = this.getHiddenProducts();

    return allProducts.filter(p => !hiddenProducts.includes(Number(p.id)));
  }

  // Reset về dữ liệu mock ban đầu
  static resetToMockData(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('hidden_products');
  }

  // Xuất dữ liệu để backup
  static exportData(): string {
    const storedProducts = this.getStoredProducts();
    const hiddenProducts = this.getHiddenProducts();

    return JSON.stringify({
      storedProducts,
      hiddenProducts,
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  // Nhập dữ liệu từ backup
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.storedProducts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.storedProducts));
      }
      if (data.hiddenProducts) {
        localStorage.setItem('hidden_products', JSON.stringify(data.hiddenProducts));
      }

      return true;
    } catch (error) {
      console.error('Lỗi khi nhập dữ liệu:', error);

      return false;
    }
  }
}

export default ProductService;
