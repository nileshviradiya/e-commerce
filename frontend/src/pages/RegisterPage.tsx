import React from 'react';
import RegistrationForm from '../features/auth/components/RegistrationForm'; // Adjusted path

const RegisterPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
