import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../models/files/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = uuidv4();
          const extension = extname(file.originalname);
          callback(null, `${uniqueName}${extension}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {} 