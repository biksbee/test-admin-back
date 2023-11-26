import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvatarUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  avatar: string;
}
