import React from 'react';
import { useProducts } from '../api/productApi';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

const ProductList: React.FC = () => {
  const { data: productResponse, error, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">Loading products...</p>
        {/* You could add a spinner here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-center">
        <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
        <p className="mt-2 text-sm text-red-700">{error.message}</p>
      </div>
    );
  }

  if (!productResponse || !productResponse.data || productResponse.data.length === 0) {
    return (
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">No products found.</p>
        <p className="mt-1 text-sm text-gray-500">
          Check back later or try seeding the products if you are an admin.
        </p>
         {/* Optionally, link to seed products if it's a dev environment and user is admin */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {productResponse.data.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
