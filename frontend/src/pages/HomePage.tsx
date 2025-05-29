import React from 'react';
import ProductList from '../features/products/components/ProductList'; // Adjust path as needed
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-center text-white shadow-xl">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          Welcome to Our Store!
        </h1>
        <p className="mt-6 text-xl leading-8">
          Discover amazing products and great deals.
        </p>
        <div className="mt-10">
          <Link
            to="/products"
            className="rounded-md bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-md hover:bg-indigo-50"
          >
            Shop All Products
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <div>
        <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-gray-900">
          Featured Products
        </h2>
        <ProductList />
      </div>
    </div>
  );
};

export default HomePage;
