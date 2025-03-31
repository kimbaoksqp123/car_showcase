import { HttpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import { AxiosResponse } from 'axios';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

type LoginResponse = AuthResponse;
type SignUpResponse = AuthResponse;

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

  async signup(data: SignUpRequest): Promise<SignUpResponse> {
    try {
      const response: AxiosResponse<SignUpResponse> = await this.httpClient.post('/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const authApi = new AuthApi(); 