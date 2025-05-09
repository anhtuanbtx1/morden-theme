// Enum for football categories
export enum FootballCategory {
  PLAYER = 'PLAYER',
  CLUB = 'CLUB',
  TOURNAMENT = 'TOURNAMENT',
  STADIUM = 'STADIUM',
  COACH = 'COACH'
}

// Interface for category color scheme
export interface CategoryColorScheme {
  backgroundColor: string;
  textColor: string;
}

// Map categories to custom color schemes
export const categoryColorMap: Record<FootballCategory, CategoryColorScheme> = {
  [FootballCategory.PLAYER]: {
    backgroundColor: '#E3F2FD', // Light Blue
    textColor: '#1976D2'        // Dark Blue
  },
  [FootballCategory.CLUB]: {
    backgroundColor: '#F3E5F5', // Light Purple
    textColor: '#9C27B0'        // Dark Purple
  },
  [FootballCategory.TOURNAMENT]: {
    backgroundColor: '#FFEBEE', // Light Red
    textColor: '#D32F2F'        // Dark Red
  },
  [FootballCategory.STADIUM]: {
    backgroundColor: '#FFF3E0', // Light Orange
    textColor: '#E64A19'        // Dark Orange
  },
  [FootballCategory.COACH]: {
    backgroundColor: '#E8F5E9', // Light Green
    textColor: '#388E3C'        // Dark Green
  }
};

// Default color scheme
const defaultColorScheme: CategoryColorScheme = {
  backgroundColor: '#E3F2FD',
  textColor: '#1976D2'
};

// Function to get color scheme for a category
export const getFootballCategoryColorScheme = (category: string): CategoryColorScheme => {
  // Check if the category exists in the enum
  if (Object.values(FootballCategory).includes(category as FootballCategory)) {
    return categoryColorMap[category as FootballCategory];
  }

  // Default color scheme if category is not found
  return defaultColorScheme;
};
