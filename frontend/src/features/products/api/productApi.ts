import { useQuery } from '@tanstack/react-query';

// Define the Product type based on the backend model (simplified)
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  inventory: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  success: boolean;
  count?: number;
  data: Product[];
  message?: string;
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
  message?: string;
}

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API function to fetch all products
const fetchProducts = async (): Promise<ProductListResponse> => {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch products');
  }
  return response.json();
};

// API function to fetch a single product by slug
const fetchProductBySlug = async (slug: string): Promise<ProductDetailResponse> => {
  const response = await fetch(`${BASE_URL}/products/${slug}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to fetch product ${slug}`);
  }
  return response.json();
};

// React Query hook for fetching all products
export const useProducts = () => {
  return useQuery<ProductListResponse, Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

// React Query hook for fetching a single product by slug
export const useProductBySlug = (slug: string | undefined) => {
  return useQuery<ProductDetailResponse, Error>({
    queryKey: ['product', slug],
    queryFn: () => {
      if (!slug) {
        // Return a resolved promise with null-like data or throw if slug is essential
        // This depends on how you want to handle missing slugs (e.g. disable query)
        return Promise.reject(new Error('Product slug is required.'));
      }
      return fetchProductBySlug(slug);
    },
    enabled: !!slug, // Only run the query if the slug is available
  });
};
