import { HttpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import { AxiosResponse } from 'axios';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
  };
  accessToken: string;
}

class AuthApi {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({
      baseUrl: API_ENDPOINTS.AUTH,
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.httpClient.post('/login', data);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const authApi = new AuthApi(); 