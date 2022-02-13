import { BeforeInsert, PrimaryColumn } from 'typeorm';
import { DatabaseEntity } from './DatabaseEntity';
import { createRandomID } from '../../Random';

/**
 * Basic database entity with an id as a primary column.
 * The id is loaded from getRandomId
 */
export abstract class DatabaseEntityWithID extends DatabaseEntity {
  @PrimaryColumn({ type: 'char', length: 16 })
    id!: string;

  @BeforeInsert()
  setId() {
    this.id = createRandomID();
  }
}
