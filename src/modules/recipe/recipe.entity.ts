import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from "typeorm";
import User from "../user/user.entity";

@Entity()
@ObjectType({ description: "Recipe entity" })
export default class Recipe {
  @PrimaryGeneratedColumn()
  @Field()
  public id: number;

  @Field()
  @Column()
  public name: string;

  @Field()
  @Column()
  public url: string;

  @Field()
  @Column({ default: "Main" })
  public dishType: string;

  @Field()
  @CreateDateColumn()
  public createdAt: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  public userId: number;
  @ManyToOne(() => User, (user: User) => user.recipes)
  public user: User;
}
