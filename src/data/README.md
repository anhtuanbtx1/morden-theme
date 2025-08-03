# Data Directory

This directory contains JSON data files that are used throughout the application.

## products.json

Contains the product data that was previously hardcoded in `ProductsData.ts`. This file stores all product information in a structured JSON format.

### Structure

Each product object contains the following fields:

```json
{
  "title": "Product Name",
  "price": 100,
  "discount": 10,
  "related": false,
  "salesPrice": 110,
  "category": ["category1", "category2"],
  "gender": "Men|Women|Kids",
  "rating": 3,
  "stock": true,
  "qty": 1,
  "colors": ["#1890FF", "#94D82D"],
  "photo": "s1.jpg",
  "id": 1,
  "createdDaysAgo": 8,
  "createdHoursAgo": 6,
  "createdMinutesAgo": 20,
  "descriptionSentences": 2
}
```

### Field Descriptions

- **title**: Product name
- **price**: Base price of the product
- **discount**: Discount amount
- **related**: Whether this product is related to others
- **salesPrice**: Actual selling price
- **category**: Array of category strings
- **gender**: Target gender (Men, Women, Kids)
- **rating**: Product rating (1-5)
- **stock**: Whether product is in stock
- **qty**: Quantity available
- **colors**: Array of color hex codes
- **photo**: Image filename (must match imported images)
- **id**: Unique product identifier
- **createdDaysAgo**: Days ago when product was created (for date calculation)
- **createdHoursAgo**: Hours ago when product was created
- **createdMinutesAgo**: Minutes ago when product was created
- **descriptionSentences**: Number of sentences for auto-generated description

### Available Images

The following image files are available and can be used in the `photo` field:
- s1.jpg through s12.jpg

### How to Add New Products

1. Add a new product object to the `products.json` array
2. Ensure the `id` is unique
3. Use an existing image filename or add new images to the assets folder and update the imageMap in `ProductsData.ts`
4. Follow the existing structure for consistency

### How to Modify Existing Products

Simply edit the values in the JSON file. Changes will be reflected when the application is restarted or the page is refreshed.

### Benefits of JSON Approach

- **Separation of Concerns**: Data is separated from code logic
- **Easy Maintenance**: Non-developers can easily modify product data
- **Version Control**: Changes to data can be tracked separately from code changes
- **Flexibility**: Easy to add/remove products without touching TypeScript code
- **Type Safety**: Still maintains TypeScript type checking through interfaces

## Export/Import Workflow

### How to Update products.json with New Data

1. **Add/Edit Products**: Use the UI to add or edit products (data is temporarily stored in localStorage)

2. **Export Data**: Click the "Export JSON" button in the product list toolbar
   - This downloads a new `products.json` file containing all current data
   - The file includes both original products and any new/modified products

3. **Replace File**:
   - Navigate to `main/src/data/products.json`
   - Replace the existing file with the downloaded file
   - Keep the same filename: `products.json`

4. **Refresh Application**:
   - Restart the development server or refresh the page
   - The new data will be loaded from the updated JSON file

### Important Notes

- **Backup**: Always backup your current `products.json` before replacing it
- **File Location**: The file must be placed exactly at `main/src/data/products.json`
- **Format**: Ensure the downloaded file maintains the correct JSON structure
- **Images**: New products will use existing image files (s1.jpg through s12.jpg)

### Troubleshooting

- If the export doesn't work, check browser console for errors
- If new data doesn't appear after refresh, verify the file was replaced correctly
- Ensure the JSON file is valid (no syntax errors)
