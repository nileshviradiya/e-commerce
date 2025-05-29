import React, { useState } from 'react';
import { useAddItemToCart } from '../api/cartApi';
import { Product } from '../../products/api/productApi'; // Assuming Product type path
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store'; // Path to root state
import { useNavigate } from 'react-router-dom';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number; // Optional quantity, defaults to 1
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, quantity = 1 }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth); // Get user from Redux state
  const { mutate: addItem, isLoading, isError, error } = useAddItemToCart(queryClient);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!user) {
      // If user is not logged in, redirect to login page or show a message
      setFeedbackMessage('Please log in to add items to your cart.');
      // Optionally, navigate to login after a delay or user action
      // navigate('/login'); 
      return;
    }

    if (product.inventory <= 0) {
      setFeedbackMessage('This product is out of stock.');
      return;
    }
    
    setFeedbackMessage(null); // Clear previous messages
    addItem(
      { productId: product._id, quantity },
      {
        onSuccess: () => {
          setFeedbackMessage(`${product.name} added to cart!`);
          setTimeout(() => setFeedbackMessage(null), 3000); // Clear message after 3s
        },
        onError: (err: any) => {
          setFeedbackMessage(err.message || 'Failed to add item. Please try again.');
           setTimeout(() => setFeedbackMessage(null), 5000);
        },
      }
    );
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isLoading || product.inventory <= 0}
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Adding...' : product.inventory <= 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
      {feedbackMessage && (
        <p className={`mt-2 text-sm ${isError || feedbackMessage.includes('Failed') || feedbackMessage.includes('Please log in') || feedbackMessage.includes('out of stock') ? 'text-red-600' : 'text-green-600'}`}>
          {feedbackMessage}
        </p>
      )}
    </>
  );
};

export default AddToCartButton;
