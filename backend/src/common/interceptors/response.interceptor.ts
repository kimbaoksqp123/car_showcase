import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const now = new Date();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Lấy thông tin về path và method
    const method = request.method;
    const url = request.url;
    
    // Log thông tin request
    console.log(`[${method}] ${url} - ${now.toISOString()}`);
    
    // Đo thời gian xử lý request
    const startTime = Date.now();
    
    return next.handle().pipe(
      map(data => {
        const endTime = Date.now();
        const processingTime = endTime - startTime;
        
        // Log thời gian xử lý
        console.log(`[${method}] ${url} - Processed in ${processingTime}ms`);
        
        // Chuẩn hóa response
        return {
          data,
          statusCode: response.statusCode,
          message: data?.message || 'Success',
          timestamp: now.toISOString(),
        };
      }),
    );
  }
} 