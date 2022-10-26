import { IsEmail, MaxLength, MinLength } from "class-validator";
import { ObjectId } from "mongodb";
import {
  Authorized,
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from "type-graphql";

export enum Role {
  admin = "admin",
  user = "user",
}

registerEnumType(Role, {
  name: "Role",
  description: "Role an user can attain",
});

@ObjectType()
export default class User {
  @Field(() => ID)
  //   @Authorized()
  _id: ObjectId;

  @Field()
  //   @Authorized()
  first_name: string;

  @Field()
  //   @Authorized()
  last_name: string;

  @Field()
  //   @Authorized()
  email: string;

  @Field()
  //   @Authorized()
  password: string;

  //   @Authorized()
  @Field({ nullable: true })
  created_at: Date;

  //   @Authorized()
  @Field({ nullable: true })
  updated_at: Date;

  @Field()
  //   @Authorized()
  user_name: string;

  @Field()
  //   @Authorized(Role.ADMIN)
  active: boolean;

  @Field(() => Role)
  //   @Authorized(Role.ADMIN)
  role: Role;
}

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  @MinLength(1)
  @MaxLength(32)
  first_name: string;

  @Field()
  @MinLength(1)
  @MaxLength(32)
  last_name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field()
  @MinLength(6)
  @MaxLength(24)
  user_name: string;

  @Field(() => ID, { nullable: true })
  _id?: ObjectId | undefined;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  active?: boolean | undefined;

  @Field(() => Role, { nullable: true, defaultValue: Role.user })
  role?: Role | undefined;
}

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field({ nullable: true })
  @MinLength(1)
  @MaxLength(32)
  first_name?: string;

  @Field({ nullable: true })
  @MinLength(1)
  @MaxLength(32)
  last_name?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  @MinLength(6)
  @MaxLength(24)
  user_name?: string;

  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @Field(() => Role, { nullable: true })
  role?: Role;
}
