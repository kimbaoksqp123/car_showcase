# Car Showcase Backend

Backend service cho ứng dụng Car Showcase, sử dụng NestJS với MySQL và PostgreSQL (vector database).

## Yêu cầu hệ thống

- Node.js (v18 trở lên)
- Docker và Docker Compose
- MySQL (v8.0 trở lên)
- PostgreSQL (v17 trở lên)

## Cấu trúc Database

### 1. MySQL Database
- **Database Name**: car_showcase
- **Port**: 3306
- **Username**: root
- **Password**: root

## Cài đặt

### 1. Cài đặt Dependencies

```bash
# Cài đặt các dependencies cần thiết
npm install

# Cài đặt các dependencies cho vector database
npm install @nestjs/typeorm typeorm pg pgvector
```

Tạo file `.env` trong thư mục `backend` với nội dung sau:

## Chạy ứng dụng

### Development Mode

```bash
# Chạy ở chế độ development
npm run start:dev
```

#

## API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký user mới
- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh-token` - Làm mới token

### Users
- `GET /users` - Lấy danh sách users
- `GET /users/:id` - Lấy thông tin user
- `PUT /users/:id` - Cập nhật thông tin user
- `DELETE /users/:id` - Xóa user

