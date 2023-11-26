import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseGuards,
  UseInterceptors,
  UploadedFile, ParseFilePipeBuilder, Request, Query
} from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { FileInterceptor } from "@nestjs/platform-express";
import { query } from "express";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto, @Query() query) {
    return this.usersService.create(createUserDto, query);
  }

  @Get('all')
  findAll(@Query() query) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatar = `http://localhost:3000/images/${file.originalname}`;
    return this.usersService.update(+id, updateUserDto);
  }

  // @Post('/upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         cb(null, `${file.originalname}`);
  //       },
  //     }),
  //   }),
  // )
  // async uploadFile(@Query() query, @UploadedFile() file: Express.Multer.File) {
  //   const avatar = `http://localhost:3000/images/${file.originalname}`;
  //   return this.usersService.updateAvatar(avatar, +query.id);
  // }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
