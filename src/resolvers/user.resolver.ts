/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, injectable } from "inversify";
import { isPresent } from "ts-is-present";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import User, {
  CreateUserInput,
  Role,
  UpdateUserInput,
} from "../models/user.model";
import UserService from "../services/user.service";

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotFound for " + message;
  }
}

@injectable()
@Resolver(User)
export default class UserResolver {
  constructor(@inject(UserService) private userService: UserService) {}

  // @Authorized(Role.admin)
  @Query((returns) => User)
  async user(@Arg("_id") _id: string) {
    const user = await this.userService.findById(_id);
    if (!isPresent(user)) throw new UserNotFoundError(_id);
    return user;
  }

  @Query((returns) => [User])
  async users() {
    return await this.userService.findAll();
  }

  @Mutation((returns) => User)
  // @Authorized(Role.admin)
  async createUser(
    @Arg("createUserInput") createUserInput: CreateUserInput
  ): Promise<User> {
    return await this.userService.createUser(createUserInput);
  }

  @Mutation((returns) => User)
  // @Authorized(Role.admin)
  async deleteUser(@Arg("_id") _id: string) {
    return await this.userService.deleteUser(_id);
  }

  @Mutation((returns) => User)
  // @Authorized(Role.admin)
  async updateUser(
    @Arg("updateUserInput") updateUserInput: UpdateUserInput,
    @Arg("_id") _id: string
  ): Promise<User> {
    return await this.userService.updateUser(updateUserInput, _id);
  }
}
