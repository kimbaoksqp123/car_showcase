import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'car_showcase',
  entities: [join(__dirname, 'dist/**/*.entity.js')],
  migrations: [join(__dirname, 'src/database/migrations/*.ts')],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
}); 