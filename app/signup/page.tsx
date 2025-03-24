import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  email: string;
  password: string;
};

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  
  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data);
    // Xử lý logic đăng ký ở đây
  };

  return (
    <div className="sign-up-container">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
            className="border border-gray-300 p-2 rounded"
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
            className="border border-gray-300 p-2 rounded"
          />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>
        
        <button
          type="submit"
          className="bg-primary-blue text-white rounded-full py-2 px-4"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
