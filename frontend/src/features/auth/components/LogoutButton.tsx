import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../../../store/store'; // Corrected path

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    // Add any redirect logic here if needed, e.g., history.push('/login');
    console.log('User logged out');
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
