import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, UserErrors } from './user.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validateUuid } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createDto: CreateUserDto): Promise<IUser> {
    if (!createDto.login || !createDto.password) {
      throw new BadRequestException(UserErrors.INCORRECT_BODY);
    }

    const newUser = {
      id: uuidv4(),
      ...createDto,
      version: 1,
    };

    const createdUser = await this.userRepository.create(newUser);

    return (await this.userRepository.save(createdUser)).toResponse();
  }

  async getUserById(userId: string): Promise<IUser> {
    if (!validateUuid(userId)) {
      throw new BadRequestException(UserErrors.INVALID_ID);
    }

    const condidate = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!condidate) {
      throw new NotFoundException(UserErrors.NOT_FOUND);
    }

    return condidate.toResponse();
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await this.userRepository.find();
    return users.map((user) => user.toResponse());
  }

  async updateUser(dto: UpdatePasswordDto, userId: string): Promise<IUser> {
    if (
      dto.newPassword === dto.oldPassword ||
      !dto.newPassword ||
      !dto.oldPassword
    ) {
      throw new BadRequestException(UserErrors.INCORRECT_BODY);
    }

    if (!validateUuid(userId)) {
      throw new BadRequestException(UserErrors.INVALID_ID);
    }

    const condidate = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (condidate) {
      if (condidate.password === dto.oldPassword) {
        condidate.password = dto.newPassword;
        condidate.version += 1;
        return (await this.userRepository.save(condidate)).toResponse();
      } else {
        throw new ForbiddenException(UserErrors.WRONG_OLD_PASSWORD);
      }
    } else {
      throw new NotFoundException(UserErrors.NOT_FOUND);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    if (!validateUuid(userId)) {
      throw new BadRequestException(UserErrors.INVALID_ID);
    }

    const condidate = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (condidate) {
      await this.userRepository.delete(userId);
    } else {
      throw new NotFoundException(UserErrors.NOT_FOUND);
    }
  }
}
