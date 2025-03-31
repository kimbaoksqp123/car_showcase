'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import { useAppSelector, useAppDispatch, clearVehicleRegistration } from '@/lib/redux';
import { VehicleType } from '@/lib/types/vehicle';
import apiClient from '@/lib/api';

const VehicleRegistrationConfirm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const vehicleData = useAppSelector((state) => state.vehicle);
  const [isOpen, setIsOpen] = useState(true);
  const [brandName, setBrandName] = useState('');
  const [modelName, setModelName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Nếu không có dữ liệu, chuyển về trang đăng ký
    if (!vehicleData.vehicleBrand || !vehicleData.vehicleModel) {
      router.push('/vehicle-registration');
      return;
    }
    
    // Tìm hiển thị tên thương hiệu và mẫu xe thay vì mã
    const fetchVehicleDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Lấy danh sách thương hiệu
        const brands = await apiClient.vehicle().getBrands(vehicleData.vehicleType as VehicleType);
        const selectedBrand = brands.find(b => b.codigo === vehicleData.vehicleBrand);
        
        if (selectedBrand) {
          setBrandName(selectedBrand.nome);
          
          // Lấy danh sách mẫu xe
          const modelsData = await apiClient.vehicle().getModels(
            vehicleData.vehicleBrand, 
            vehicleData.vehicleType as VehicleType
          );
          
          const selectedModel = modelsData.modelos.find(m => m.codigo === vehicleData.vehicleModel);
          
          if (selectedModel) {
            setModelName(selectedModel.nome);
          } else {
            setModelName(vehicleData.vehicleModel);
          }
        } else {
          setBrandName(vehicleData.vehicleBrand);
        }
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to fetch vehicle details. Using code values instead.");
        setBrandName(vehicleData.vehicleBrand);
        setModelName(vehicleData.vehicleModel);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicleDetails();
  }, [vehicleData, router]);
  
  const handleConfirm = () => {
    // Xử lý gửi dữ liệu đến backend
    // Giả sử đã gửi thành công
    alert('Vehicle registration submitted successfully!');
    
    // Xóa dữ liệu khỏi Redux store
    dispatch(clearVehicleRegistration());
    
    // Chuyển về trang chủ
    router.push('/');
  };
  
  const handleEdit = () => {
    // Quay lại trang đăng ký để chỉnh sửa
    router.push('/vehicle-registration');
  };
  
  const getVehicleTypeName = (type: string) => {
    switch(type) {
      case VehicleType.CARS:
        return 'Car';
      case VehicleType.MOTORCYCLES:
        return 'Motorcycle';
      case VehicleType.TRUCKS:
        return 'Truck';
      default:
        return type;
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
                    Confirm Vehicle Registration
                  </DialogTitle>
                  
                  {error && (
                    <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">
                      {error}
                    </div>
                  )}
                  
                  {loading ? (
                    <div className="flex justify-center my-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-4">
                        <h4 className="text-lg font-medium text-gray-900">Vehicle Information</h4>
                        <div className="mt-2 bg-gray-50 p-4 rounded">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm font-medium text-gray-700">Type:</div>
                            <div className="text-sm text-gray-900">{getVehicleTypeName(vehicleData.vehicleType as string)}</div>
                            
                            <div className="text-sm font-medium text-gray-700">Brand:</div>
                            <div className="text-sm text-gray-900">{brandName}</div>
                            
                            <div className="text-sm font-medium text-gray-700">Model:</div>
                            <div className="text-sm text-gray-900">{modelName}</div>
                            
                            <div className="text-sm font-medium text-gray-700">Quantity:</div>
                            <div className="text-sm text-gray-900">{vehicleData.quantity}</div>
                            
                            <div className="text-sm font-medium text-gray-700">Purchase Date:</div>
                            <div className="text-sm text-gray-900">{vehicleData.purchaseDate}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-lg font-medium text-gray-900">Buyer Information</h4>
                        <div className="mt-2 bg-gray-50 p-4 rounded">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm font-medium text-gray-700">Name:</div>
                            <div className="text-sm text-gray-900">{vehicleData.buyerName}</div>
                            
                            <div className="text-sm font-medium text-gray-700">Phone:</div>
                            <div className="text-sm text-gray-900">{vehicleData.phoneNumber}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex gap-4 justify-center">
                        <button
                          type="button"
                          className="bg-gray-300 text-gray-800 rounded-full py-2 px-4 hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                          onClick={handleEdit}
                        >
                          Edit Information
                        </button>
                        
                        <button
                          type="button"
                          className="bg-primary-blue text-white rounded-full py-2 px-4 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
                          onClick={handleConfirm}
                        >
                          Confirm Registration
                        </button>
                      </div>
                    </>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default VehicleRegistrationConfirm; 