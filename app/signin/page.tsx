'use client';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  
  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log("Form data:", data);
    alert(`Email: ${data.email}\nPassword: ${data.password}`);
    // Xử lý logic đăng ký ở đây
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="sign-up-container w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>
          
          <button
            type="submit"
            className="bg-primary-blue text-white rounded-full py-2 px-4 mt-2 hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
