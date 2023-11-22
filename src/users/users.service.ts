import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });
    if (existUser) {
      throw new BadRequestException('This username already exist!');
    }
    const user = await this.userRepository.save({
      ...createUserDto,
      password: await argon2.hash(createUserDto.password),
    });
    const token = this.jwtService.sign({
      username: createUserDto.username,
      id: createUserDto.id,
    });
    return { user, token };
  }

  findAll() {
    return 'HEY HI';
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
