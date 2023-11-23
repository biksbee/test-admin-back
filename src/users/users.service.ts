import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
// import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
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
        avatar: 'http://localhost:3000/uploads/defImage.jpg',
        password: createUserDto.password,
        // password: await argon2.hash(createUserDto.password),
      });
      const token = this.jwtService.sign({
        username: createUserDto.username,
      });
      return { user, token };
    } catch (err) {
      console.log(err);
    }
  }

  async getAuthUser(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `${updateUserDto} This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
