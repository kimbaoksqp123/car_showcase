import { API_ENDPOINTS } from '@/lib/api/config';
import { HttpClient } from '@/lib/api/httpClient';
import { 
  VehicleBrand, 
  VehicleDetails,
  VehicleModel, 
  VehicleModelResponse, 
  VehicleType, 
  VehicleYear 
} from '@/lib/types/vehicle';

/**
 * Vehicle API client for accessing FIPE API endpoints
 */
export class VehicleApi {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({
      baseUrl: API_ENDPOINTS.FIPE,
    });
  }

  /**
   * Get all vehicle brands by type
   */
  public async getBrands(type: VehicleType = VehicleType.CARS): Promise<VehicleBrand[]> {
    return this.httpClient.get<VehicleBrand[]>(`/${type}/marcas`);
  }

  /**
   * Get all models for a specific brand
   */
  public async getModels(
    brandCode: string,
    type: VehicleType = VehicleType.CARS
  ): Promise<VehicleModelResponse> {
    return this.httpClient.get<VehicleModelResponse>(
      `/${type}/marcas/${brandCode}/modelos`
    );
  }

  /**
   * Get all years for a specific brand and model
   */
  public async getYears(
    brandCode: string,
    modelCode: string,
    type: VehicleType = VehicleType.CARS
  ): Promise<VehicleYear[]> {
    return this.httpClient.get<VehicleYear[]>(
      `/${type}/marcas/${brandCode}/modelos/${modelCode}/anos`
    );
  }

  /**
   * Get details for a specific vehicle (brand, model, year)
   */
  public async getVehicleDetails(
    brandCode: string,
    modelCode: string,
    yearCode: string,
    type: VehicleType = VehicleType.CARS
  ): Promise<VehicleDetails> {
    return this.httpClient.get<VehicleDetails>(
      `/${type}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`
    );
  }
} 