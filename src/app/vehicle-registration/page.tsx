'use client';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle, Field, Label, Input } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVehicleData } from '@/lib/hooks/useVehicleData';
import { VehicleType } from '@/lib/api/types/vehicle';
import { useAppDispatch, useAppSelector, setVehicleRegistration } from '@/lib/redux';

type VehicleRegistrationInputs = {
  vehicleType: VehicleType;
  vehicleBrand: string;
  vehicleModel: string;
  quantity: number;
  purchaseDate: string;
  buyerName: string;
  phoneNumber: string;
};

const VehicleRegistration = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const savedData = useAppSelector((state) => state.vehicle);
  
  const { register, handleSubmit, formState: { errors }, control, watch, setValue } = useForm<VehicleRegistrationInputs>({
    defaultValues: {
      vehicleType: savedData.vehicleType as VehicleType || VehicleType.CARS,
      vehicleBrand: savedData.vehicleBrand || '',
      vehicleModel: savedData.vehicleModel || '',
      quantity: savedData.quantity || 1,
      purchaseDate: savedData.purchaseDate || '',
      buyerName: savedData.buyerName || '',
      phoneNumber: savedData.phoneNumber || ''
    }
  });
  
  const [isOpen, setIsOpen] = useState(true);
  const selectedVehicleType = watch('vehicleType');
  const selectedBrand = watch('vehicleBrand');
  
  // Get vehicle data using our custom hook
  const {
    brands,
    models,
    loading,
    error,
    fetchBrands,
    fetchModels,
    clearError
  } = useVehicleData(selectedVehicleType as VehicleType);

  // When vehicle type changes, fetch brands
  useEffect(() => {
    fetchBrands();
  }, [selectedVehicleType, fetchBrands]);

  // When brand changes, fetch models
  useEffect(() => {
    if (selectedBrand) {
      fetchModels(selectedBrand);
    }
  }, [selectedBrand, fetchModels]);
  
  const onSubmit: SubmitHandler<VehicleRegistrationInputs> = data => {
    console.log("Form data:", data);
    
    // Lưu dữ liệu vào Redux store
    dispatch(setVehicleRegistration(data));
    
    // Chuyển hướng đến trang xác nhận
    router.push('/vehicle-registration-confirm');
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
                    Vehicle Registration
                  </DialogTitle>
                  
                  {error && (
                    <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">
                      {error}
                      <button 
                        onClick={clearError}
                        className="ml-2 text-sm underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                  
                  {loading && (
                    <div className="mb-4 p-2 bg-blue-50 text-blue-500 rounded text-center">
                      Loading data...
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Field className="space-y-1">
                      <Label className="block text-sm font-medium text-gray-700">
                        Vehicle Type
                      </Label>
                      <Controller
                        control={control}
                        name="vehicleType"
                        rules={{ required: 'Vehicle type is required' }}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                          >
                            <option value={VehicleType.CARS}>Cars</option>
                            <option value={VehicleType.MOTORCYCLES}>Motorcycles</option>
                            <option value={VehicleType.TRUCKS}>Trucks</option>
                          </select>
                        )}
                      />
                      {errors.vehicleType && <span className="text-red-500 text-sm">{errors.vehicleType.message}</span>}
                    </Field>

                    <div className="flex gap-4">
                      <Field className="space-y-1 w-1/2">
                        <Label className="block text-sm font-medium text-gray-700">
                          Brand
                        </Label>
                        <Controller
                          control={control}
                          name="vehicleBrand"
                          rules={{ required: 'Vehicle brand is required' }}
                          render={({ field }) => (
                            <select
                              {...field}
                              disabled={brands.length === 0 || loading}
                              className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue disabled:bg-gray-100"
                            >
                              <option value="">Select brand</option>
                              {brands.map((brand) => (
                                <option key={brand.codigo} value={brand.codigo}>
                                  {brand.nome}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {errors.vehicleBrand && <span className="text-red-500 text-sm">{errors.vehicleBrand.message}</span>}
                      </Field>

                      <Field className="space-y-1 w-1/2">
                        <Label className="block text-sm font-medium text-gray-700">
                          Model
                        </Label>
                        <Controller
                          control={control}
                          name="vehicleModel"
                          rules={{ required: 'Vehicle model is required' }}
                          render={({ field }) => (
                            <select
                              {...field}
                              disabled={!models || loading}
                              className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue disabled:bg-gray-100"
                            >
                              <option value="">Select model</option>
                              {models?.modelos.map((model) => (
                                <option key={model.codigo} value={model.codigo}>
                                  {model.nome}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {errors.vehicleModel && <span className="text-red-500 text-sm">{errors.vehicleModel.message}</span>}
                      </Field>
                    </div>

                    <div className="flex gap-4">
                      <Field className="space-y-1 w-1/2">
                        <Label className="block text-sm font-medium text-gray-700">
                          Quantity
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="e.g. 1"
                          {...register('quantity', { 
                            required: 'Quantity is required',
                            min: { value: 1, message: 'Quantity must be at least 1' },
                            valueAsNumber: true
                          })}
                          className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                        />
                        {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity.message}</span>}
                      </Field>

                      <Field className="space-y-1 w-1/2">
                        <Label className="block text-sm font-medium text-gray-700">
                          Purchase Date
                        </Label>
                        <Input
                          type="date"
                          {...register('purchaseDate', { required: 'Purchase date is required' })}
                          className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                        />
                        {errors.purchaseDate && <span className="text-red-500 text-sm">{errors.purchaseDate.message}</span>}
                      </Field>
                    </div>

                    <Field className="space-y-1">
                      <Label className="block text-sm font-medium text-gray-700">
                        Buyer's Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="Full name"
                        {...register('buyerName', { required: 'Buyer\'s name is required' })}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                      />
                      {errors.buyerName && <span className="text-red-500 text-sm">{errors.buyerName.message}</span>}
                    </Field>

                    <Field className="space-y-1">
                      <Label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        placeholder="e.g. +1 234 567 8900"
                        {...register('phoneNumber', { 
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                            message: 'Invalid phone number format'
                          }
                        })}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none data-[focus]:ring-2 data-[focus]:ring-primary-blue"
                      />
                      {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber.message}</span>}
                    </Field>
                    
                    <button
                      type="submit"
                      className="bg-primary-blue text-white rounded-full py-2 px-4 mt-4 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                      disabled={loading}
                    >
                      Continue to Confirmation
                    </button>
                    
                    <div className="mt-2 text-center text-sm text-gray-500">
                      <Link href="/" className="font-medium text-primary-blue hover:underline">
                        Back to Home
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

export default VehicleRegistration; 