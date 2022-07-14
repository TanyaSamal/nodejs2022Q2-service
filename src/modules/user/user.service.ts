import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, UserErrors } from './user.interface';
import { db } from '../../data/db';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validateUuid } from 'src/utils';

@Injectable()
export class UserService {
  async createUser(createDto: CreateUserDto): Promise<IUser> {
    if (!createDto.login || !createDto.password) {
      throw new BadRequestException(UserErrors.INCORRECT_BODY);
    }

    const newUser: IUser = {
      id: uuidv4(),
      ...createDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    db.users.push(newUser);

    const responce: IUser = { ...newUser };
    delete responce.password;

    return responce;
  }

  async getUserById(id: string): Promise<IUser> {
    if (!validateUuid(id)) {
      throw new BadRequestException(UserErrors.INVALID_ID);
    }

    const condidate = db.users.find((user) => user.id === id);

    if (!condidate) {
      throw new NotFoundException(UserErrors.NOT_FOUND);
    }

    const responce: IUser = { ...condidate };
    delete responce.password;

    return responce;
  }

  async getAllUsers(): Promise<IUser[]> {
    return db.users;
  }

  async updateUser(dto: UpdatePasswordDto, id: string): Promise<IUser> {
    if (
      dto.newPassword === dto.oldPassword ||
      !dto.newPassword ||
      !dto.oldPassword
    ) {
      throw new BadRequestException(UserErrors.INCORRECT_BODY);
    }

    if (!validateUuid(id)) {
      throw new BadRequestException(UserErrors.INVALID_ID);
    }

    const condidateIndex = db.users.findIndex((user) => user.id === id);

    if (condidateIndex !== -1) {
      if (db.users[condidateIndex].password === dto.oldPassword) {
        db.users[condidateIndex].password = dto.newPassword;
        db.users[condidateIndex].version += 1;
        db.users[condidateIndex].updatedAt = Date.now();
      } else {
        throw new ForbiddenException(UserErrors.WRONG_OLD_PASSWORD);
      }
    } else {
      throw new NotFoundException(UserErrors.NOT_FOUND);
    }

    const responce: IUser = { ...db.users[condidateIndex] };
    delete responce.password;

    return responce;
  }

  async deleteUser(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException(UserErrors.INVALID_ID);
    }

    const condidateIndex = db.users.findIndex((user) => user.id === id);

    if (condidateIndex !== -1) {
      db.users.splice(condidateIndex, 1);
    } else {
      throw new NotFoundException(UserErrors.NOT_FOUND);
    }
  }
}
