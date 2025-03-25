import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: number;

  @Column({ length: 100 })
  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @Column({ length: 100 })
  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'User email address (unique)' })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Whether the user is an admin' })
  isAdmin: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date when the user was created' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Date when the user was last updated' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Mã hóa mật khẩu nếu nó được thay đổi
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }
} 