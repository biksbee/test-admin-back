import { IsString, IsInt, IsEmail } from 'class-validator';

export class CreateUserDto {

  // @IsString()
  // name: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
  //
  // @IsInt()
  // age: number;
  //
  // @IsString()
  // sex: string;
  // address: number[];
  // employees: number[];
  // avatar: string;
  //
  // @IsEmail()
  // email: string;
}
