// Enum for blog categories
export enum BlogCategory {
  KOF = 'KOF',
  TAY_DU_KY = 'Tây Du Ký',
  ANH_HUNG = 'Anh Hùng',
  SOCIAL = 'Social',
  HEALTH = 'Health',
  TECHNOLOGY = 'TECHNOLOGY',
  FASHION = 'Fashion',
  TRAVEL = 'marvel',
  FOOD = 'Food',
  BUSINESS = 'Business',
}

// Interface for category color scheme
export interface CategoryColorScheme {
  backgroundColor: string;
  textColor: string;
}

// Map categories to custom color schemes
export const categoryColorMap: Record<BlogCategory, CategoryColorScheme> = {
  [BlogCategory.KOF]: {
    backgroundColor: '#E3F2FD', // Light Blue
    textColor: '#1976D2'        // Dark Blue
  },
  [BlogCategory.TAY_DU_KY]: {
    backgroundColor: '#F3E5F5', // Light Purple
    textColor: '#9C27B0'        // Dark Purple
  },
  [BlogCategory.ANH_HUNG]: {
    backgroundColor: '#FFEBEE', // Light Red
    textColor: '#D32F2F'        // Dark Red
  },
  [BlogCategory.SOCIAL]: {
    backgroundColor: '#FFF3E0', // Light Orange
    textColor: '#E64A19'        // Dark Orange
  },
  [BlogCategory.HEALTH]: {
    backgroundColor: '#E8F5E9', // Light Green
    textColor: '#388E3C'        // Dark Green
  },
  [BlogCategory.TECHNOLOGY]: {
    backgroundColor: '#E0F7FA', // Light Cyan
    textColor: '#0097A7'        // Dark Cyan
  },
  [BlogCategory.FASHION]: {
    backgroundColor: '#FCE4EC', // Light Pink
    textColor: '#C2185B'        // Dark Pink
  },
  [BlogCategory.TRAVEL]: {
    backgroundColor: '#FFFDE7', // Light Yellow
    textColor: '#FBC02D'        // Dark Yellow
  },
  [BlogCategory.FOOD]: {
    backgroundColor: '#EFEBE9', // Light Brown
    textColor: '#5D4037'        // Dark Brown
  },
  [BlogCategory.BUSINESS]: {
    backgroundColor: '#E8EAF6', // Light Indigo
    textColor: '#3949AB'        // Dark Indigo
  },
};

// Default color scheme
const defaultColorScheme: CategoryColorScheme = {
  backgroundColor: '#E3F2FD',
  textColor: '#1976D2'
};

// Function to get color scheme for a category
export const getCategoryColorScheme = (category: string): CategoryColorScheme => {
  // Check if the category exists in the enum
  if (Object.values(BlogCategory).includes(category as BlogCategory)) {
    return categoryColorMap[category as BlogCategory];
  }

  // Default color scheme if category is not found
  return defaultColorScheme;
};
