export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  sku: string;
  description: string;
}

export type CategoryFilter = 'All' | 'Electronics' | 'Displays' | 'Accessories' | 'Audio';
