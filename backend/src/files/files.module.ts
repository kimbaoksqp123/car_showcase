import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../models/files/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          console.log('Processing file:', file.originalname);
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          console.log('Generated filename:', filename);
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, callback) => {
        console.log('Filtering file:', file.originalname, file.mimetype);
        callback(null, true);
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {} 