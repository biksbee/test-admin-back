import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export class DefUser1701152551224 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('hi');
    const userRepository = queryRunner.manager.getRepository(User);
    const existingUser = await userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!existingUser) {
      const newUser = new User();
      newUser.username = 'admin';
      newUser.password = 'admin';
      await userRepository.save(newUser);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
