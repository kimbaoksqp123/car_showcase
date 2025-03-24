/**
 * API Client exports and factory
 */

import { VehicleApi } from './vehicleApi';

// Export types
export * from './types/vehicle';
export * from './config';

// Export API clients
export { VehicleApi } from './vehicleApi';
export { HttpClient } from './httpClient';

// API client instances
let vehicleApiInstance: VehicleApi | null = null;

// API client factory
export const apiClient = {
  /**
   * Get the vehicle API client
   */
  vehicle(): VehicleApi {
    if (!vehicleApiInstance) {
      vehicleApiInstance = new VehicleApi();
    }
    return vehicleApiInstance;
  }
};

// Default export for easy importing
export default apiClient; 