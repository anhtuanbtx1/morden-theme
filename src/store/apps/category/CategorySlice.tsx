import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from 'src/store/Store';
import { CategoryType, CategoryFilterType } from 'src/types/apps/category';
import CategoryService from 'src/services/CategoryService';

interface CategoryState {
  categories: CategoryType[];
  loading: boolean;
  error: string | null;
  filters: CategoryFilterType;
  selectedCategory: CategoryType | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all'
  },
  selectedCategory: null
};

export const CategorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Get all categories
    getCategories: (state, action: PayloadAction<CategoryType[]>) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Add new category
    addCategory: (state, action: PayloadAction<CategoryType>) => {
      state.categories.push(action.payload);
    },

    // Update category
    updateCategory: (state, action: PayloadAction<CategoryType>) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },

    // Delete category
    deleteCategory: (state, action: PayloadAction<number>) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    },

    // Set search filter
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },

    // Set status filter
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: 'all'
      };
    },

    // Set selected category
    setSelectedCategory: (state, action: PayloadAction<CategoryType | null>) => {
      state.selectedCategory = action.payload;
    }
  }
});

export const {
  setLoading,
  setError,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setSearchFilter,
  setStatusFilter,
  resetFilters,
  setSelectedCategory
} = CategorySlice.actions;

// Async thunks
export const fetchCategories = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const categories = CategoryService.getVisibleCategories();
    dispatch(getCategories(categories));
  } catch (error) {
    dispatch(setError('Lỗi khi tải danh sách danh mục'));
    console.error('Error fetching categories:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const createCategory = (categoryData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const newCategory = CategoryService.addCategory(categoryData);
    dispatch(addCategory(newCategory));
    dispatch(setError(null));

    return newCategory;
  } catch (error: any) {
    const errorMessage = error.message || 'Lỗi khi thêm danh mục';
    dispatch(setError(errorMessage));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const editCategory = (id: number, categoryData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const updatedCategory = CategoryService.updateCategory(id, categoryData);
    if (updatedCategory) {
      dispatch(updateCategory(updatedCategory));
      dispatch(setError(null));

      return updatedCategory;
    } else {
      throw new Error('Không tìm thấy danh mục để cập nhật');
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Lỗi khi cập nhật danh mục';
    dispatch(setError(errorMessage));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeCategory = (id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const success = CategoryService.deleteCategory(id);
    if (success) {
      dispatch(deleteCategory(id));
      dispatch(setError(null));

      return true;
    } else {
      throw new Error('Không thể xóa danh mục');
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Lỗi khi xóa danh mục';
    dispatch(setError(errorMessage));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const searchCategories = (query: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const categories = CategoryService.searchCategories(query);
    dispatch(getCategories(categories));
    dispatch(setSearchFilter(query));
  } catch (error) {
    dispatch(setError('Lỗi khi tìm kiếm danh mục'));
    console.error('Error searching categories:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const filterCategoriesByStatus = (status: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const categories = CategoryService.filterCategoriesByStatus(status);
    dispatch(getCategories(categories));
    dispatch(setStatusFilter(status));
  } catch (error) {
    dispatch(setError('Lỗi khi lọc danh mục'));
    console.error('Error filtering categories:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const resetCategoryData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    CategoryService.resetToInitialData();
    const categories = CategoryService.getVisibleCategories();
    dispatch(getCategories(categories));
    dispatch(resetFilters());
    dispatch(setError(null));
  } catch (error) {
    dispatch(setError('Lỗi khi reset dữ liệu'));
    console.error('Error resetting category data:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export default CategorySlice.reducer;
