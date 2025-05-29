import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../api/productApi'; // Assuming Product type is defined here

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Use a placeholder if images array is empty or first image is not set
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/images/default-product.jpg';

  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 ease-in-out group-hover:shadow-lg">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-opacity duration-300 ease-in-out group-hover:opacity-75"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {product.description.substring(0, 60)}... 
          </p>
          <p className="mt-2 text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          {product.inventory <= 0 && (
             <p className="mt-2 text-sm text-red-500">Out of Stock</p>
          )}
           {product.inventory > 0 && product.inventory < 10 && (
             <p className="mt-2 text-sm text-yellow-500">Low Stock ({product.inventory} left)</p>
           )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
