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
- **Mục đích**: Lưu trữ thông tin người dùng, xe, và các dữ liệu cơ bản

### 2. PostgreSQL Vector Database
- **Database Name**: car_showcases
- **Port**: 5555
- **Username**: root
- **Password**: root
- **Mục đích**: Lưu trữ vector embeddings cho tính năng tìm kiếm semantic
- **Extension**: pgvector (v0.5.1)

## Cài đặt

### 1. Cài đặt Dependencies

```bash
# Cài đặt các dependencies cần thiết
npm install

# Cài đặt dependencies cho file upload
npm install multer @nestjs/platform-express @types/multer uuid @types/uuid
```
### 3. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `backend`

## Chạy ứng dụng

### Development Mode

```bash
# Chạy ở chế độ development
npm run start:dev
```



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

### File Upload (Admin only)
- `POST /files/upload` - Upload nhiều files (Admin)
- `GET /files` - Lấy danh sách files đã upload (Admin)
- `GET /files/:filename` - Xem/tải một file (Public)
- `DELETE /files/:filename` - Xóa một file (Admin)

## Quyền Admin

Để sử dụng tính năng upload file, user phải có quyền admin (`isAdmin = true`). Admin có thể:
- Upload nhiều files cùng lúc (tối đa 10 files, mỗi file tối đa 10MB)
- Xem danh sách tất cả các files đã upload
- Xóa files đã upload
