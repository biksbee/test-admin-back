import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  name: string | null;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  email: string | null;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  age: number | null;

  @ApiProperty()
  @IsString()
  sex: string | null;

  @ApiProperty()
  address: number[] | null;

  @ApiProperty()
  adminid: number | null;

  @ApiProperty()
  avatar: string | null;
}
