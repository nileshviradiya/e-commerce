import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { setUserFromToken, logout } from './features/auth/store/authSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LogoutButton from './features/auth/components/LogoutButton';
import { UserData } from './features/auth/api/authApi';

// Mock function to simulate fetching user data based on token (same as before)
const fetchUserByToken = async (token: string): Promise<UserData | null> => {
  console.log('Validating token and fetching user data for token:', token);
  try {
    const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
    if (decodedToken.exp * 1000 < Date.now()) {
      console.log('Token expired');
      return null;
    }
    const mockUser: UserData = {
      _id: decodedToken.id,
      email: decodedToken.email || 'testuser@example.com',
      firstName: decodedToken.firstName || 'Test',
      lastName: decodedToken.lastName || 'User',
      role: decodedToken.role || 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return mockUser;
  } catch (error) {
    console.error('Token validation/decoding error:', error);
    return null;
  }
};

import { useCart } from './features/cart/api/cartApi'; // Import useCart

// Simple Navbar Component
const Navbar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: cartResponse } = useCart(); // Fetch cart data for item count

  const cartItemCount = cartResponse?.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          E-Commerce Store
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/products" className="hover:text-gray-300">Products</Link>
          <Link to="/cart" className="relative flex items-center hover:text-gray-300">
            {/* Basic Cart Icon (Heroicons - outline: shopping-bag) */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};


function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const attemptAutoLogin = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !user) {
        const userData = await fetchUserByToken(storedToken);
        if (userData) {
          dispatch(setUserFromToken({ user: userData, token: storedToken }));
        } else {
          dispatch(logout());
        }
      }
      setAppLoading(false);
    };
    attemptAutoLogin();
  }, [dispatch, user]);

  if (appLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading application...</p>
        {/* You could add a more sophisticated loader/spinner here */}
      </div>
    );
  }

  return (
    <Router>
      <div className="App flex min-h-screen flex-col bg-gray-100">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/cart" element={<CartPage />} /> {/* Add CartPage route */}
            {/* Add more routes here as needed, e.g., protected routes for dashboard, cart, checkout */}
            {/* Example of a protected route:
            <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
            */}
            <Route path="*" element={<Navigate to="/" />} /> {/* Fallback for unknown routes */}
          </Routes>
        </main>
        <footer className="bg-gray-800 p-4 text-center text-white">
          <p>&copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
