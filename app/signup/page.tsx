'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle, Field, Label, Input } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/redux/features/authSlice';
import { authApi } from '@/lib/api/authApi';
import toast from 'react-hot-toast';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm_password: string;
};

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<Inputs>();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const dispatch = useDispatch();
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setError('');
      setIsLoading(true);
      const { confirm_password, ...signupData } = data;
      
      const response = await authApi.signup(signupData);
      
      // Store the access token and user info
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
      
      // Update Redux store
      dispatch(setCredentials({
        user: response.user,
        accessToken: response.accessToken
      }));

      // Show success message
      toast.success('Sign up successful! Redirecting...');
      
      // Wait for 1 second before redirecting
      setTimeout(() => {
        router.push('/');
        router.refresh(); // Refresh the page to ensure state is updated
      }, 1000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up');
      toast.error(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-bold mb-4 text-center text-gray-900"
                  >
                    Sign Up
                  </DialogTitle>
                  
                  {error && (
                    <div className="text-red-500 text-sm mb-4">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <Field className="space-y-1 w-1/2">
                        <Label className="block text-sm font-medium text-gray-700">
                          First Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="First name"
                          {...register('firstName', { 
                            required: 'First name is required',
                            minLength: { value: 2, message: 'First name must be at least 2 characters' }
                          })}
                          className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                          disabled={isLoading}
                        />
                        {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
                      </Field>

                      <Field className="space-y-1 w-1/2">
                        <Label className="block text-sm font-medium text-gray-700">
                          Last Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="Last name"
                          {...register('lastName', { 
                            required: 'Last name is required',
                            minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                          })}
                          className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                          disabled={isLoading}
                        />
                        {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
                      </Field>
                    </div>

                    <Field className="space-y-1">
                      <Label className="block text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                        disabled={isLoading}
                      />
                      {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </Field>

                    <Field className="space-y-1">
                      <Label className="block text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                        disabled={isLoading}
                      />
                      {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </Field>

                    <Field className="space-y-1">
                      <Label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        {...register('confirm_password', { 
                          required: 'Confirm Password is required',
                          validate: value => value === getValues('password') || 'Passwords do not match'
                        })}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                        disabled={isLoading}
                      />
                      {errors.confirm_password && <span className="text-red-500 text-sm">{errors.confirm_password.message}</span>}
                    </Field>
                    
                    <button
                      type="submit"
                      className="bg-primary-blue text-white rounded-full py-2 px-4 mt-4 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    
                    <div className="mt-2 text-center text-sm text-gray-500">
                      Already have an account?{' '}
                      <Link href="/signin" className="font-medium text-primary-blue hover:underline">
                        Sign in
                      </Link>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SignUp;
