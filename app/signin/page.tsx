'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { authApi } from '@/lib/api/authApi';

type Inputs = {
  email: string;
  password: string;
};

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setError('');
      setIsLoading(true);
      
      const response = await authApi.login(data);
      // Lưu token và thông tin user vào localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      
      // Chuyển hướng về trang chủ
      router.push('/');
      
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="sign-up-container w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              disabled={isLoading}
              {...register('email', { required: 'Email is required' })}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              disabled={isLoading}
              {...register('password', { required: 'Password is required' })}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary-blue text-white rounded-full py-2 px-4 mt-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
