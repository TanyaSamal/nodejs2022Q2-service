import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const salt = process.env.CRYPT_SALT || 10;

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  version: number;

  @CreateDateColumn({
    transformer: {
      to: (value: Date) => value,
      from: (value: Date) => value.getTime(),
    },
  })
  createdAt: number;

  @UpdateDateColumn({
    transformer: {
      to: (value: Date) => value,
      from: (value: Date) => value.getTime(),
    },
  })
  updatedAt: number;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(String(this.password), Number(salt));
  }

  toResponse() {
    const { id, login, version, createdAt, updatedAt } = this;
    return { id, login, version, createdAt, updatedAt };
  }
}
