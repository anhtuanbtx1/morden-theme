import { CategoryType, CategoryFormData, getRandomCategoryColor } from 'src/types/apps/category';

const STORAGE_KEY = 'category_management';

// Mock initial data
const initialCategories: CategoryType[] = [
  {
    id: 1,
    categoryCode: 'TECH',
    categoryName: 'Công nghệ',
    description: 'Các bài viết về công nghệ, lập trình, và phần mềm',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    color: '#E3F2FD'
  },
  {
    id: 2,
    categoryCode: 'HEALTH',
    categoryName: 'Sức khỏe',
    description: 'Thông tin về sức khỏe, y tế và chăm sóc bản thân',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    color: '#E8F5E9'
  },
  {
    id: 3,
    categoryCode: 'TRAVEL',
    categoryName: 'Du lịch',
    description: 'Kinh nghiệm du lịch, địa điểm tham quan',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    color: '#FFF3E0'
  },
  {
    id: 4,
    categoryCode: 'FOOD',
    categoryName: 'Ẩm thực',
    description: 'Công thức nấu ăn, đánh giá nhà hàng',
    status: 'inactive',
    createdAt: new Date('2024-02-10'),
    color: '#FFEBEE'
  }
];

class CategoryService {
  // Lấy tất cả danh mục (kết hợp mock data + localStorage)
  static getAllCategories(): CategoryType[] {
    try {
      const storedCategories = localStorage.getItem(STORAGE_KEY);
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);

        // Kết hợp mock data với dữ liệu đã lưu
        return [...initialCategories, ...parsedCategories];
      }

      return initialCategories;
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);

      return initialCategories;
    }
  }

  // Lấy danh mục hiển thị (không bao gồm danh mục đã ẩn)
  static getVisibleCategories(): CategoryType[] {
    try {
      const hiddenCategories = this.getHiddenCategories();

      return this.getAllCategories().filter(category => !hiddenCategories.includes(Number(category.id)));
    } catch (error) {
      console.error('Lỗi khi lọc danh mục hiển thị:', error);

      return this.getAllCategories();
    }
  }

  // Lấy danh sách ID danh mục đã ẩn
  static getHiddenCategories(): number[] {
    try {
      const hidden = localStorage.getItem('hidden_categories');

      return hidden ? JSON.parse(hidden) : [];
    } catch (error) {
      console.error('Lỗi khi đọc danh sách danh mục ẩn:', error);

      return [];
    }
  }

  // Lấy danh mục đã lưu trong localStorage (không bao gồm mock data)
  static getStoredCategories(): CategoryType[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Lỗi khi đọc danh mục đã lưu:', error);

      return [];
    }
  }

  // Thêm danh mục mới
  static addCategory(categoryData: CategoryFormData): CategoryType {
    try {
      const existingCategories = this.getStoredCategories();
      const allCategories = this.getAllCategories();
      
      // Kiểm tra trùng mã danh mục
      const isDuplicateCode = allCategories.some(cat => 
        cat.categoryCode.toLowerCase() === categoryData.categoryCode.toLowerCase()
      );
      
      if (isDuplicateCode) {
        throw new Error('Mã danh mục đã tồn tại');
      }
      
      // Tạo ID mới (lớn hơn tất cả ID hiện có)
      const maxId = Math.max(...allCategories.map(c => Number(c.id)), 0);
      const newCategory: CategoryType = {
        ...categoryData,
        id: maxId + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        color: categoryData.color || getRandomCategoryColor()
      };

      // Lưu vào localStorage (chỉ lưu danh mục mới, không lưu mock data)
      const updatedStoredCategories = [...existingCategories, newCategory];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStoredCategories));

      return newCategory;
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      throw error;
    }
  }

  // Cập nhật danh mục
  static updateCategory(id: number, updatedData: Partial<CategoryFormData>): CategoryType | null {
    try {
      const storedCategories = this.getStoredCategories();
      const categoryIndex = storedCategories.findIndex(c => c.id === id);
      
      if (categoryIndex !== -1) {
        // Cập nhật danh mục trong localStorage
        const updatedCategory = {
          ...storedCategories[categoryIndex],
          ...updatedData,
          updatedAt: new Date()
        };

        storedCategories[categoryIndex] = updatedCategory;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCategories));

        return updatedCategory;
      }
      
      // Không thể cập nhật danh mục mock (chỉ có thể ẩn)
      const mockCategory = initialCategories.find(c => c.id === id);
      if (mockCategory) {
        throw new Error('Không thể chỉnh sửa danh mục mặc định');
      }
      
      return null;
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      throw error;
    }
  }

  // Xóa danh mục
  static deleteCategory(id: number): boolean {
    try {
      const storedCategories = this.getStoredCategories();
      const filteredCategories = storedCategories.filter(c => c.id !== id);

      if (filteredCategories.length !== storedCategories.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCategories));

        return true;
      }

      // Không thể xóa danh mục mock (chỉ có thể ẩn)
      const mockCategory = initialCategories.find(c => c.id === id);
      if (mockCategory) {
        // Đánh dấu danh mục mock là đã ẩn
        const hiddenCategories = this.getHiddenCategories();
        hiddenCategories.push(id);
        localStorage.setItem('hidden_categories', JSON.stringify(hiddenCategories));

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      throw error;
    }
  }

  // Lấy danh mục theo ID
  static getCategoryById(id: number): CategoryType | null {
    const allCategories = this.getAllCategories();

    return allCategories.find(c => c.id === id) || null;
  }

  // Tìm kiếm danh mục
  static searchCategories(query: string): CategoryType[] {
    const categories = this.getVisibleCategories();
    if (!query.trim()) return categories;

    const searchTerm = query.toLowerCase();

    return categories.filter(category =>
      category.categoryName.toLowerCase().includes(searchTerm) ||
      category.categoryCode.toLowerCase().includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm)
    );
  }

  // Lọc danh mục theo trạng thái
  static filterCategoriesByStatus(status: string): CategoryType[] {
    const categories = this.getVisibleCategories();
    if (status === 'all') return categories;

    return categories.filter(category => category.status === status);
  }

  // Reset về dữ liệu ban đầu
  static resetToInitialData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('hidden_categories');
    } catch (error) {
      console.error('Lỗi khi reset dữ liệu:', error);
      throw error;
    }
  }
}

export default CategoryService;
