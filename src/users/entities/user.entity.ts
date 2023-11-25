import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string | null;

  @Column()
  username: string;

  @Column({ nullable: true })
  email: string | null;

  @Column()
  password: string;

  @Column({ nullable: true })
  age: number | null;

  @Column({ nullable: true })
  sex: string | null;

  @Column({ type: 'float', array: true, nullable: true })
  address: number[] | null;

  @Column({ nullable: true })
  adminid: number | null;

  @Column({ nullable: true })
  avatar: string | null;
}
