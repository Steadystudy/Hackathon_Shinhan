import { Field, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @CreateDateColumn()
  @Field((type) => Date, { nullable: true })
  createdAt?: Date;

  @UpdateDateColumn()
  @Field((type) => Date, { nullable: true })
  updatedAt?: Date;
}
