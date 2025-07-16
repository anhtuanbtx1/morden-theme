export interface CategoryType {
  id: number | string;
  categoryCode: string;
  categoryName: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: string;
  color?: string;
}

export interface CategoryFormData {
  categoryCode: string;
  categoryName: string;
  description: string;
  status: 'active' | 'inactive';
  color?: string;
}

export interface CategoryFilterType {
  search: string;
  status: string;
}

// Enum for category status
export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// Interface for category color scheme
export interface CategoryColorScheme {
  backgroundColor: string;
  textColor: string;
}

// Default color schemes for categories
export const defaultCategoryColors = [
  '#E3F2FD', // Light Blue
  '#F3E5F5', // Light Purple
  '#FFEBEE', // Light Red
  '#FFF3E0', // Light Orange
  '#E8F5E9', // Light Green
  '#FFF8E1', // Light Yellow
  '#FCE4EC', // Light Pink
  '#F1F8E9', // Light Lime
  '#E0F2F1', // Light Teal
  '#F3E5F5'  // Light Indigo
];

// Function to get random color for new categories
export const getRandomCategoryColor = (): string => {
  return defaultCategoryColors[Math.floor(Math.random() * defaultCategoryColors.length)];
};

// Function to get color scheme for a category
export const getCategoryColorScheme = (color?: string): CategoryColorScheme => {
  if (color) {
    return {
      backgroundColor: color,
      textColor: '#333333'
    };
  }
  
  return {
    backgroundColor: '#F5F5F5',
    textColor: '#666666'
  };
};
