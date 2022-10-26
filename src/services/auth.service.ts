import { compareSync } from "bcrypt";
import { injectable } from "inversify";
import { sign } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import User from "../models/user.model";
import { Context } from "../utils/auth.util";
import { getCollection } from "../utils/db.util";

@injectable()
export default class AuthenticationService {
  private users = getCollection().users;

  async me(context: Context) {
    const user = (await this.users.findOne({
      _id: new ObjectId(context.payload?._id),
    })) as User;
    return user;
  }

  async login(email: string, password: string) {
    const user = (await this.users.findOne({ email })) as User;
    if (!user) throw new Error("User not found");

    const validPassword = compareSync(password, user.password);
    if (!validPassword) throw new Error("Password is incorrect");

    const token = sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    return { token, user };
  }
}
