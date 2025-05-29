import React, { useState, useEffect } from 'react';
import { useCart, useUpdateCartItemQuantity, useRemoveItemFromCart, CartItem } from '../features/cart/api/cartApi';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const CartPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: cartResponse, isLoading, error: cartError, refetch } = useCart();
  
  const { mutate: updateQuantity, isLoading: isUpdating } = useUpdateCartItemQuantity(queryClient);
  const { mutate: removeItem, isLoading: isRemoving } = useRemoveItemFromCart(queryClient);

  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user && !isLoading) { // If not loading and no user, redirect
        navigate('/login?message=Please log in to view your cart.');
    }
  }, [user, isLoading, navigate]);

  useEffect(()_ => {
    if (cartResponse?.data?.items) {
      const quantities = cartResponse.data.items.reduce((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {} as Record<string, number>);
      setItemQuantities(quantities);
    }
  }, [cartResponse]);
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 0) { // Allow 0 for removal via update
      setItemQuantities(prev => ({ ...prev, [productId]: newQuantity }));
    }
  };

  const handleUpdateItem = (productId: string) => {
    const newQuantity = itemQuantities[productId];
    if (newQuantity === undefined) return; // Should not happen
    updateQuantity({ productId, quantity: newQuantity });
  };
  
  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const calculateSubtotal = (items: CartItem[]): number => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  if (isLoading) return <div className="container mx-auto p-4 text-center">Loading cart...</div>;
  if (cartError) return <div className="container mx-auto p-4 text-center text-red-600">Error loading cart: {cartError.message} <button onClick={() => refetch()} className="text-blue-500">Try again</button></div>;
  if (!cartResponse?.success || !cartResponse.data || cartResponse.data.items.length === 0) {
    return (
      <div className="container mx-auto p-4 py-12 text-center">
        <h1 className="text-3xl font-semibold text-gray-700">Your Cart is Empty</h1>
        <p className="mt-4 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="mt-6 inline-block rounded-md bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700">
          Shop Products
        </Link>
      </div>
    );
  }

  const { items } = cartResponse.data;
  const subtotal = calculateSubtotal(items);

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-gray-900">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ul role="list" className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg">
            {items.map((item) => (
              <li key={item.productId} className="flex flex-col p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <img 
                    src={item.image || '/images/default-product.jpg'} 
                    alt={item.name} 
                    className="h-24 w-24 rounded-md object-cover sm:h-32 sm:w-32"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link to={`/products/${item.productId}`}>{item.name}</Link> {/* Assuming slug is productId or can be fetched */}
                    </h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-col sm:items-end">
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0" // Allow 0 for removal via update button
                      value={itemQuantities[item.productId] || item.quantity}
                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value, 10))}
                      className="w-20 rounded-md border-gray-300 text-center shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button 
                      onClick={() => handleUpdateItem(item.productId)}
                      disabled={isUpdating && itemQuantities[item.productId] === item.quantity}
                      className="ml-2 rounded-md bg-blue-500 p-2 text-xs text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isUpdating ? '...' : 'Update'}
                    </button>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.productId)} 
                    disabled={isRemoving}
                    className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 sm:mt-0 sm:ml-4"
                  >
                    {isRemoving ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-1">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">Order Summary</h2>
            <div className="flex justify-between py-2 text-gray-700">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {/* Add Taxes, Shipping etc. later */}
            <div className="mt-4 flex justify-between border-t pt-4 text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span> {/* Replace with actual total later */}
            </div>
            <button
              disabled={items.length === 0}
              className="mt-6 w-full rounded-md bg-indigo-600 py-3 text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
