import { useState, useEffect, useCallback } from 'react';
import apiClient, { 
  VehicleBrand,
  VehicleModelResponse,
  VehicleYear,
  VehicleDetails,
  VehicleType,
  ApiError
} from '../api';

interface VehicleDataState {
  brands: VehicleBrand[];
  models: VehicleModelResponse | null;
  years: VehicleYear[];
  vehicleDetails: VehicleDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: VehicleDataState = {
  brands: [],
  models: null,
  years: [],
  vehicleDetails: null,
  loading: false,
  error: null,
};

export function useVehicleData(vehicleType: VehicleType = VehicleType.CARS) {
  const [state, setState] = useState<VehicleDataState>(initialState);

  // Reset error state
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fetch all vehicle brands
  const fetchBrands = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiClient.vehicle().getBrands(vehicleType);
      setState(prev => ({ ...prev, brands: data, loading: false }));
      return data;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch brands';
      setState(prev => ({ ...prev, error: message, loading: false }));
      return [];
    }
  }, [vehicleType]);

  // Fetch models for a specific brand
  const fetchModels = useCallback(async (brandCode: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, models: null }));
    
    try {
      const data = await apiClient.vehicle().getModels(brandCode, vehicleType);
      setState(prev => ({ ...prev, models: data, loading: false }));
      return data;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch models';
      setState(prev => ({ ...prev, error: message, loading: false }));
      return null;
    }
  }, [vehicleType]);

  // Fetch years for a specific model
  const fetchYears = useCallback(async (brandCode: string, modelCode: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, years: [] }));
    
    try {
      const data = await apiClient.vehicle().getYears(brandCode, modelCode, vehicleType);
      setState(prev => ({ ...prev, years: data, loading: false }));
      return data;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch years';
      setState(prev => ({ ...prev, error: message, loading: false }));
      return [];
    }
  }, [vehicleType]);

  // Fetch vehicle details
  const fetchVehicleDetails = useCallback(async (brandCode: string, modelCode: string, yearCode: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, vehicleDetails: null }));
    
    try {
      const data = await apiClient.vehicle().getVehicleDetails(brandCode, modelCode, yearCode, vehicleType);
      setState(prev => ({ ...prev, vehicleDetails: data, loading: false }));
      return data;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to fetch vehicle details';
      setState(prev => ({ ...prev, error: message, loading: false }));
      return null;
    }
  }, [vehicleType]);

  // Load brands on initial mount
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    ...state,
    fetchBrands,
    fetchModels,
    fetchYears,
    fetchVehicleDetails,
    clearError,
    setVehicleType: (type: VehicleType) => {
      // This will cause the hook to re-run with the new vehicle type
      return { vehicleType: type };
    }
  };
} 