import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
      return { ...user, token };
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

  async allUsers() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto, file) {
    const isExist = await this.userRepository.findOne({
      where: { id },
    });
    if (!isExist) throw new NotFoundException('User not found');
    console.log(updateUserDto);
    const avatar =
      file !== undefined
        ? `http://localhost:3000/images/${file.originalname}`
        : isExist.avatar;
    const age =
      updateUserDto.age !== undefined
        ? JSON.parse(String(updateUserDto.age))
        : isExist.age;
    const address =
      updateUserDto.address !== undefined
        ? JSON.parse(String(updateUserDto.address))
        : isExist.address;

    await this.userRepository.update(id, {
      ...updateUserDto,
      avatar,
      age,
      address,
    });
    return await this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const queryRecursiveDelete = `
      WITH RECURSIVE subordinates AS (
      SELECT id, adminid
    FROM "users"
    WHERE id = $1
    UNION
    SELECT e.id, e.adminid
    FROM "users" e
    INNER JOIN subordinates s ON e.adminid = s.id
  )
    DELETE FROM "users" WHERE id IN (SELECT id FROM subordinates)`;

    return await this.userRepository.query(queryRecursiveDelete, [id]);
  }
}
