/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, injectable } from "inversify";
import { isPresent } from "ts-is-present";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import User, { CreateUserInput, UpdateUserInput } from "../models/user.model";
import UserService from "../services/user.service";

class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotFound for " + message;
  }
}

@injectable()
@Resolver(User)
export default class UserResolver {
  constructor(@inject(UserService) private userService: UserService) {}

  @Query((returns) => User)
  async user(@Arg("_id") _id: string) {
    const user = await this.userService.findById(_id);
    if (!isPresent(user)) throw new UserNotFoundError(_id);
    return user;
  }

  @Query((returns) => [User])
  // @Authorized()
  async users() {
    return await this.userService.findAll();
  }

  @Mutation((returns) => User)
  // @Authorized()
  async createUser(
    @Arg("createUserInput") createUserInput: CreateUserInput
  ): Promise<User> {
    return await this.userService.createUser(createUserInput);
  }

  @Mutation((returns) => User)
  // @Authorized()
  async deleteUser(@Arg("_id") _id: string) {
    return await this.userService.deleteUser(_id);
  }

  @Mutation((returns) => User)
  // @Authorized()
  async updateUser(
    @Arg("updateUserInput") updateUserInput: UpdateUserInput,
    @Arg("_id") _id: string
  ): Promise<User> {
    return await this.userService.updateUser(updateUserInput, _id);
  }
}
