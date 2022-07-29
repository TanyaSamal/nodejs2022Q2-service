import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, UserErrors } from './user.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validateUuid } from 'src/utils/utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  async createUser(createDto: CreateUserDto): Promise<IUser> {
    if (
      !createDto.login ||
      !createDto.password ||
      typeof createDto.login !== 'string' ||
      typeof createDto.password !== 'string'
    ) {
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
    return users;
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
      if (await bcrypt.compare(dto.oldPassword, condidate.password)) {
        condidate.password = await this.hashPassword(dto.newPassword);
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

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      String(password),
      Number(this.configService.get('CRYPT_SALT')),
    );
  }
}
