import React from 'react';
import LoginForm from '../features/auth/components/LoginForm'; // Adjusted path

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
