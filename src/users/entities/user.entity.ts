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

  @Column({ type: 'jsonb', array: true, nullable: true })
  address: [number, number] | null;

  @Column({ type: 'jsonb', array: true, nullable: true })
  employees: number[] | null;

  @Column({ nullable: true })
  avatar: string | null;
}
