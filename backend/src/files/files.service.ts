import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../models/files/entities/file.entity';

@Injectable()
export class FilesService {
  private readonly uploadDir = './uploads';

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {
    // Ensure upload directory exists
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    try {
      await fs.access(this.uploadDir);
    } catch (e) {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFileInfo(fileData: {
    originalName: string;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  }): Promise<File> {
    const file = this.fileRepository.create(fileData);
    return this.fileRepository.save(file);
  }

  async getFiles(): Promise<File[]> {
    return this.fileRepository.find({
      order: {
        uploadedAt: 'DESC',
      },
    });
  }

  async getFilePath(filename: string): Promise<string> {
    const filePath = join(this.uploadDir, filename);
    
    try {
      await fs.access(filePath);
      return filePath;
    } catch (error) {
      throw new NotFoundException(`File ${filename} not found`);
    }
  }

  async getFileByFilename(filename: string): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { filename },
    });
    
    if (!file) {
      throw new NotFoundException(`File ${filename} not found`);
    }
    
    return file;
  }

  async deleteFile(filename: string): Promise<void> {
    const file = await this.getFileByFilename(filename);
    const filePath = join(this.uploadDir, filename);
    
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      await this.fileRepository.remove(file);
    } catch (error) {
      // If file doesn't exist on disk, at least remove from database
      if (error.code === 'ENOENT') {
        await this.fileRepository.remove(file);
      } else {
        throw new NotFoundException(`File ${filename} not found`);
      }
    }
  }
} 