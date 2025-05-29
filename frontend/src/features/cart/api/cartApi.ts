import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';

// Define types for Cart and CartItem based on backend model
export interface CartItem {
  _id?: string; // ID of the cart item itself, if backend sends it
  productId: string; // Reference to Product _id
  quantity: number;
  price: number; // Price at the time of adding to cart
  name: string;
  image?: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice?: number; // If calculated by backend and sent
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
  message?: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  productId: string;
  quantity: number;
}

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper to get the auth token
const getAuthToken = (): string | null => localStorage.getItem('token');

// API function to get the user's cart
const fetchCart = async (): Promise<CartResponse> => {
  const token = getAuthToken();
  if (!token) return Promise.reject(new Error('Not authenticated'));

  const response = await fetch(`${BASE_URL}/cart`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch cart');
  }
  return response.json();
};

// API function to add an item to the cart
const addItemToCartApi = async (item: AddToCartPayload): Promise<CartResponse> => {
  const token = getAuthToken();
  if (!token) return Promise.reject(new Error('Not authenticated'));

  const response = await fetch(`${BASE_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add item to cart');
  }
  return response.json();
};

// API function to update cart item quantity
const updateCartItemQuantityApi = async (item: UpdateCartItemPayload): Promise<CartResponse> => {
  const token = getAuthToken();
  if (!token) return Promise.reject(new Error('Not authenticated'));

  const response = await fetch(`${BASE_URL}/cart/items/${item.productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity: item.quantity }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update cart item quantity');
  }
  return response.json();
};

// API function to remove an item from the cart
const removeItemFromCartApi = async (productId: string): Promise<CartResponse> => {
  const token = getAuthToken();
  if (!token) return Promise.reject(new Error('Not authenticated'));

  const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to remove item from cart');
  }
  return response.json();
};


// React Query hook for fetching the cart
export const useCart = () => {
  return useQuery<CartResponse, Error>({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: !!getAuthToken(), // Only fetch if token exists
  });
};

// React Query hook for adding an item to the cart
export const useAddItemToCart = (queryClient: QueryClient) => {
  return useMutation<CartResponse, Error, AddToCartPayload>({
    mutationFn: addItemToCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// React Query hook for updating cart item quantity
export const useUpdateCartItemQuantity = (queryClient: QueryClient) => {
  return useMutation<CartResponse, Error, UpdateCartItemPayload>({
    mutationFn: updateCartItemQuantityApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// React Query hook for removing an item from the cart
export const useRemoveItemFromCart = (queryClient: QueryClient) => {
  return useMutation<CartResponse, Error, string>({ // Second type arg is Error, third is payload type (productId)
    mutationFn: removeItemFromCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
