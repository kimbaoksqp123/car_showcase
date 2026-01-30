import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VehicleType } from '@/lib/types/vehicle';

export interface VehicleRegistrationState {
  vehicleType: VehicleType | string;
  vehicleBrand: string;
  vehicleModel: string;
  quantity: number;
  purchaseDate: string;
  buyerName: string;
  phoneNumber: string;
  isSubmitted: boolean;
}

const initialState: VehicleRegistrationState = {
  vehicleType: VehicleType.CARS,
  vehicleBrand: '',
  vehicleModel: '',
  quantity: 1,
  purchaseDate: '',
  buyerName: '',
  phoneNumber: '',
  isSubmitted: false,
};

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setVehicleRegistration: (state, action: PayloadAction<Partial<VehicleRegistrationState>>) => {
      return { ...state, ...action.payload };
    },
    clearVehicleRegistration: (state) => {
      return initialState;
    },
    setSubmitted: (state, action: PayloadAction<boolean>) => {
      state.isSubmitted = action.payload;
    },
  },
});

export const { setVehicleRegistration, clearVehicleRegistration, setSubmitted } = vehicleSlice.actions;

export default vehicleSlice.reducer; 