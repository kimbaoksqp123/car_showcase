import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_TIMEOUT, ApiError, DEFAULT_HEADERS, HTTP_STATUS } from './config';

interface RequestOptions extends AxiosRequestConfig {
  timeout?: number;
}

interface HttpClientConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  beforeRequest?: (url: string, options: RequestOptions) => Promise<RequestOptions>;
  afterResponse?: (response: AxiosResponse, data: any) => Promise<any>;
}

/**
 * Http Client for making API requests
 */
export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private axiosInstance: AxiosInstance;
  private beforeRequest?: (url: string, options: RequestOptions) => Promise<RequestOptions>;
  private afterResponse?: (response: AxiosResponse, data: any) => Promise<any>;

  constructor(config: HttpClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.defaultHeaders = config.defaultHeaders || DEFAULT_HEADERS;
    this.beforeRequest = config.beforeRequest;
    this.afterResponse = config.afterResponse;
    
    // Khởi tạo axios instance
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: API_TIMEOUT,
      headers: this.defaultHeaders
    });
    
    // Thiết lập interceptors cho error handling
    this.setupInterceptors();
  }
  
  /**
   * Thiết lập interceptors
   */
  private setupInterceptors() {
    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isCancel(error)) {
          throw new ApiError('Request timeout', 0, { originalError: error });
        }
        
        if (error.response) {
          // Lỗi từ server với status code
          throw new ApiError(
            error.response.data?.message || error.response.statusText || 'An error occurred',
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // Không nhận được response
          throw new ApiError('No response from server', HTTP_STATUS.SERVER_ERROR, {
            originalError: error
          });
        } else {
          // Lỗi khi setup request
          throw new ApiError(error.message || 'Request failed', HTTP_STATUS.SERVER_ERROR, {
            originalError: error
          });
        }
      }
    );
  }

  /**
   * Helper to build the full URL
   */
  private buildUrl(url: string): string {
    return url.startsWith('http') ? url : `${this.baseUrl}${url}`;
  }

  /**
   * Make an HTTP request
   */
  public async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const fullUrl = this.buildUrl(url);
    
    let requestOptions: RequestOptions = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      }
    };

    if (this.beforeRequest) {
      requestOptions = await this.beforeRequest(fullUrl, requestOptions);
    }

    try {
      const response = await this.axiosInstance({
        url: fullUrl,
        ...requestOptions
      });
      
      const data = response.data;
      
      if (this.afterResponse) {
        return await this.afterResponse(response, data);
      }
      
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (axios.isCancel(error)) {
        throw new ApiError('Request timeout', 0, { originalError: error });
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        HTTP_STATUS.SERVER_ERROR,
        { originalError: error }
      );
    }
  }

  /**
   * Make a GET request
   */
  public get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request(url, { ...options, method: 'GET' });
  }

  /**
   * Make a POST request
   */
  public post<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const requestOptions: RequestOptions = {
      ...options,
      method: 'POST',
      data
    };

    return this.request(url, requestOptions);
  }

  /**
   * Make a PUT request
   */
  public put<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const requestOptions: RequestOptions = {
      ...options,
      method: 'PUT',
      data
    };

    return this.request(url, requestOptions);
  }

  /**
   * Make a DELETE request
   */
  public delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request(url, { ...options, method: 'DELETE' });
  }
} 