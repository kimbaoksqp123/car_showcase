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

# Cài đặt các dependencies cho vector database
npm install @nestjs/typeorm typeorm pg pgvector

# Cài đặt dependencies cho file upload
npm install multer @nestjs/platform-express @types/multer uuid @types/uuid
```

### 2. Cài đặt PostgreSQL với pgvector

1. Tạo container PostgreSQL:
```bash
docker run --name postgres-container \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=car_showcases \
  -p 5555:5432 \
  -d postgres:17
```

2. Cài đặt pgvector extension:
```bash
# Kết nối vào container
docker exec -it postgres-container bash

# Cài đặt dependencies
apt-get update && apt-get install -y postgresql-17-pgvector

# Thoát khỏi container
exit

# Khởi động lại container
docker restart postgres-container

# Tạo extension vector trong database
docker exec -it postgres-container psql -U root -d car_showcases -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 3. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```env
# Server Configuration
PORT=3001

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=car_showcase
DB_SYNCHRONIZE=true
DB_LOGGING=true
```

## Chạy ứng dụng

### Development Mode

```bash
# Chạy ở chế độ development
npm run start:dev
```

### Production Mode

```bash
# Build ứng dụng
npm run build

# Chạy ở chế độ production
npm run start:prod
```

## Cấu trúc Project

```
backend/
├── src/
│   ├── authentication/     # Authentication module
│   ├── users/              # Users module
│   ├── files/              # Files upload module
│   ├── common/             # Shared components
│   ├── config/             # Configuration files
│   └── app.module.ts       # Root module
├── uploads/                # Folder for uploaded files
├── .env                    # Environment variables
└── package.json            # Project dependencies
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

## Testing

```bash
# Chạy unit tests
npm run test

# Chạy e2e tests
npm run test:e2e
```

## Troubleshooting

### PostgreSQL Connection Issues
1. Kiểm tra container có đang chạy không:
```bash
docker ps | grep postgres
```

2. Kiểm tra logs của container:
```bash
docker logs postgres-container
```

3. Kiểm tra kết nối database:
```bash
docker exec -it postgres-container psql -U root -d car_showcases
```

### Vector Extension Issues
1. Kiểm tra extension đã được cài đặt:
```bash
docker exec -it postgres-container psql -U root -d car_showcases -c "\dx"
```

2. Nếu extension chưa được cài đặt, thực hiện lại các bước cài đặt pgvector.

### Upload Issues
1. Kiểm tra thư mục uploads đã được tạo:
```bash
ls -la uploads
```

2. Kiểm tra quyền của thư mục uploads:
```bash
chmod -R 755 uploads
```

## Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

