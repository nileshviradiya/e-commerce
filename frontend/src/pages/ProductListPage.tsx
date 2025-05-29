import React from 'react';
import ProductList from '../features/products/components/ProductList'; // Adjust path as needed

const ProductListPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Our Products
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Browse our collection of high-quality items.
        </p>
      </div>
      <ProductList />
    </div>
  );
};

export default ProductListPage;
