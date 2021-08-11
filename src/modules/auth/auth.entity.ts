import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, comment: '用户名', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;
}
