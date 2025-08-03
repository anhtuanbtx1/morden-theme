/**
 * Interface for product data structure in JSON files
 * This interface defines the structure of product data as stored in JSON format,
 * before it's transformed into the ProductType interface used throughout the application.
 */
export interface ProductJsonData {
  /** Product name/title */
  title: string;
  
  /** Base price of the product */
  price: number;
  
  /** Discount amount */
  discount: number;
  
  /** Whether this product is related to others */
  related: boolean;
  
  /** Actual selling price */
  salesPrice: number;
  
  /** Array of category strings */
  category: string[];
  
  /** Target gender (Men, Women, Kids, All) */
  gender: string;
  
  /** Product rating (1-5) */
  rating: number;
  
  /** Whether product is in stock */
  stock: boolean;
  
  /** Quantity available */
  qty: number;
  
  /** Array of color hex codes */
  colors: string[];
  
  /** Image filename (must match imported images) */
  photo: string;
  
  /** Unique product identifier */
  id: number;
  
  /** Days ago when product was created (for date calculation) */
  createdDaysAgo: number;
  
  /** Hours ago when product was created */
  createdHoursAgo: number;
  
  /** Minutes ago when product was created */
  createdMinutesAgo: number;
  
  /** Number of sentences for auto-generated description */
  descriptionSentences: number;
}

/**
 * Type for the entire products JSON array
 */
export type ProductsJsonData = ProductJsonData[];
