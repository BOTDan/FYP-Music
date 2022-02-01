import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Test')
export class Test {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    name!: string;

  @Column()
    description!: string;
}
export default Test;
