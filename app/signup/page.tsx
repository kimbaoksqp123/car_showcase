'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle, Field, Label, Input } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Link from 'next/link';

type Inputs = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<Inputs>();
  const [isOpen, setIsOpen] = useState(true);
  
  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log("Form data:", data);
    // Xử lý logic đăng ký ở đây
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
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <Field className="space-y-1 w-1/2">
                        <Label className="block text-sm font-medium text-gray-700">
                          First Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="First name"
                          {...register('first_name', { required: 'First name is required' })}
                          className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                        />
                        {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name.message}</span>}
                      </Field>

                      <Field className="space-y-1 w-1/2">
                        <Label className="block text-sm font-medium text-gray-700">
                          Last Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="Last name"
                          {...register('last_name', { required: 'Last name is required' })}
                          className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                        />
                        {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name.message}</span>}
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
                      />
                      {errors.confirm_password && <span className="text-red-500 text-sm">{errors.confirm_password.message}</span>}
                    </Field>
                    
                    <button
                      type="submit"
                      className="bg-primary-blue text-white rounded-full py-2 px-4 mt-4 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                    >
                      Create Account
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
