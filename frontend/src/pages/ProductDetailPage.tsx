import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductBySlug } from '../features/products/api/productApi'; // Adjust path as needed
import AddToCartButton from '../features/cart/components/AddToCartButton'; // Import AddToCartButton

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); // Get slug from URL
  const { data: productResponse, error, isLoading, isError } = useProductBySlug(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-700">Loading product details...</p>
      </div>
    );
  }

  if (isError || !productResponse?.success || !productResponse?.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="rounded-md bg-red-50 p-6 text-center shadow-md">
          <h3 className="text-xl font-medium text-red-800">Error</h3>
          <p className="mt-2 text-red-700">
            {error?.message || productResponse?.message || 'Could not load product details.'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Please check the product slug or try again later.
          </p>
        </div>
      </div>
    );
  }

  const product = productResponse.data;
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/images/default-product.jpg';

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="md:flex">
          {/* Product Image Section */}
          <div className="md:w-1/2">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full max-h-[500px] w-full object-cover object-center"
            />
            {/* TODO: Image gallery for multiple images */}
          </div>

          {/* Product Info Section */}
          <div className="p-6 md:w-1/2 lg:p-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
            
            <div className="mt-3">
              <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }} // Assuming description might contain HTML
              />
            </div>

            <div className="mt-8">
              {product.inventory > 0 ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                  In Stock ({product.inventory} available)
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="mt-10">
              <AddToCartButton product={product} />
            </div>
            
            {/* Placeholder for reviews, related products, etc. */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
