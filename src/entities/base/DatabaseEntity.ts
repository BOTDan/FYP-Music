import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Most basic database entity.
 * Contains a dateCreated and dateUpdated field.
 */
export abstract class DatabaseEntity {
  @CreateDateColumn()
    dateCreated!: Date;

  @UpdateDateColumn()
    dateUpdated!: Date;
}
