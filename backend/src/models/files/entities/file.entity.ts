import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier of the file' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Original file name' })
  originalName: string;

  @Column()
  @ApiProperty({ description: 'File name on the server' })
  filename: string;

  @Column()
  @ApiProperty({ description: 'File path on the server' })
  path: string;

  @Column()
  @ApiProperty({ description: 'MIME type of the file' })
  mimetype: string;

  @Column()
  @ApiProperty({ description: 'Size of the file in bytes' })
  size: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date when the file was uploaded' })
  uploadedAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Date when the file was last updated' })
  updatedAt: Date;
} 