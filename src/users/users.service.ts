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
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log(q);
    // const existUser = await this.userRepository.findOne({
    //   where: {
    //     username: createUserDto.,
    //   },
    // });
    // console.log('H: ' + existUser);
    // if (existUser) {
    //   throw new BadRequestException('This username already exist!');
    // }
    // const user = await this.userRepositor y.save({
    //   ...createUserDto,
    //   password: await argon2.hash(createUserDto.password),
    // });
    // const token = this.jwtService.sign({
    //   username: createUserDto.username,
    //   id: createUserDto.id,
    // });
    // return { user, token };
    return 'This action adds a new user!';
  }

  async getAuthUser(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  findAll() {
    return 'HEY HI';
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
    return `This action removes a #${id} user`;
  }
}
