import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAvatarUserDto } from "./dto/updateAvatar-user.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
// import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto, query) {
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
        avatar: 'http://localhost:3000/images/defImage.jpg',
        password: createUserDto.password,
        address: [51.5074, -0.1278],
        adminid: query.id,
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

  async findAll(query) {
    const { id } = query;
    const queryRecursive = `WITH RECURSIVE subordinates AS (
        SELECT id, name, username, email, password, age, sex, address, adminid, avatar
      FROM "users"
      WHERE id = ${id}
        UNION
      SELECT e.id, e.name, e.username, e.email, e.password, e.age, e.sex, e.address, e.adminid, e.avatar
      FROM "users" e
      INNER JOIN subordinates s ON e.adminid = s.id
    )
      SELECT * FROM subordinates`;
    const subordinates = await this.userRepository.query(queryRecursive);
    return { data: subordinates };
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const isExist = await this.userRepository.findOne({
      where: { id },
    });
    if (!isExist) throw new NotFoundException('User not found');
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateAvatar(avatar: string, id: number) {
    console.log(id);
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ avatar })
      .where('id = :id', { id })
      .execute();
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    console.log(updatedUser);
    return await this.userRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
