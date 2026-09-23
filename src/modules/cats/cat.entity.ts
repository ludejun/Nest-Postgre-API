import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class CatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  // age 和 breed 此前只存在于 Cat 接口和 controller 里，表上没有对应列，
  // TypeORM 会静默丢弃它们。
  @Column({ type: 'int', name: 'age', default: 0 })
  age: number;

  @Column({ type: 'varchar', name: 'breed', default: '' })
  breed: string;
}
