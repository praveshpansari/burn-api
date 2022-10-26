import { inject, injectable } from "inversify";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import User from "../models/user.model";
import AuthenticationService from "../services/auth.service";
import { Context, isAuth } from "../utils/auth.util";

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;

  user: User;
}

@injectable()
@Resolver(() => User)
export default class AuthenticationResolver {
  constructor(
    @inject(AuthenticationService) private authService: AuthenticationService
  ) {}

  @Query(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() ctx: Context): Promise<User> {
    return await this.authService.me(ctx);
  }

  @Mutation(() => AuthPayload)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<AuthPayload> {
    return await this.authService.login(email, password);
  }
}
