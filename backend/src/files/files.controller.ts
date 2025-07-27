import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { Public } from '../common/decorators/public.decorator';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { File } from '../models/files/entities/file.entity';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @Public()
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    console.log('Received files:', files?.length);
    
    if (!files || files.length === 0) {
      console.log('No files received');
      return {
        message: 'No files uploaded',
        files: [],
      };
    }

    try {
      const savedFiles = await this.filesService.uploadFiles(files);
      console.log('Files saved successfully:', savedFiles.length);
      
      return {
        message: 'Files uploaded successfully',
        files: savedFiles,
      };
    } catch (error) {
      console.error('Error saving files:', error);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get all files (admin only)' })
  async getAllFiles(): Promise<File[]> {
    return this.filesService.getFiles();
  }

  @Get(':filename')
  @Public() // Allow public access to view files
  @ApiOperation({ summary: 'Get a file by filename (public)' })
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = await this.filesService.getFilePath(filename);
    res.sendFile(filePath);
  }

  @Delete(':filename')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete a file by filename (admin only)' })
  async deleteFile(@Param('filename') filename: string) {
    await this.filesService.deleteFile(filename);
    return { message: `File ${filename} successfully deleted` };
  }
} 