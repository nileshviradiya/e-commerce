// Define types for request and response data
export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Password is sent for registration
}

export interface UserLoginData {
  email: string;
  password?: string; // Password is sent for login
}

export interface AuthResponse {
  success: boolean;
  data?: UserData; // User data from backend (excluding password)
  token?: string;
  message?: string;
}

export interface UserData {
  _id: string;
  firstName: string;
  lastName:string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
  // addresses and paymentMethods can be added if needed
}

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Adjust if your backend runs elsewhere

export const registerUserApi = async (userData: UserRegistrationData): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to register');
  }
  return response.json();
};

export const loginUserApi = async (userData: UserLoginData): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to login');
  }
  return response.json();
};
