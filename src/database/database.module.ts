import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EntityManager } from 'typeorm';
import { User } from "../users/entities/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        migrations: [join(__dirname, '..', 'migrations/**/*{.js,.ts}')],
        migrationsRun: true,
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  constructor(private readonly entityManager: EntityManager) {
    this.someMethod();
  }

  async someMethod() {
    const newUser = new User();
    newUser.username = 'admin';
    newUser.password = 'admin';
    newUser.address = [40.7128, -74.006];
    await this.entityManager.save(newUser);
  }
}
