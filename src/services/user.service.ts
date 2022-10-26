import { hashSync } from "bcrypt";
import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import User, { CreateUserInput, UpdateUserInput } from "../models/user.model";
import { getCollection } from "../utils/db.util";

@injectable()
export default class UserService {
  private users = getCollection().users;

  async findById(_id: string): Promise<User> {
    const user = (await this.users.findOne({
      _id: new ObjectId(_id),
      active: true,
    })) as User;
    return user || null;
  }

  async findAll(): Promise<User[]> {
    return (
      ((await this.users.find({ active: true }).toArray()) as User[]) || []
    );
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const newUser: User = {
      ...input,
      password: hashSync(input.password, 10),
      created_at: new Date(),
      updated_at: new Date(),
    } as User;

    const id = (await this.users.insertOne(newUser)).insertedId;
    return (await this.users.findOne({ _id: id })) as User;
  }

  async updateUser(input: UpdateUserInput, _id: string) {
    const updatedUser: User = input as User;
    const query = { _id: new ObjectId(_id) };
    const result = await this.users.findOneAndUpdate(
      query,
      {
        $set: { ...updatedUser, updated_at: new Date() },
      },
      { returnDocument: "after" }
    );

    return result.value as User;
  }

  async deleteUser(_id: string): Promise<User> {
    const query = { _id: new ObjectId(_id) };
    const result = await getCollection().users.findOneAndUpdate(
      query,
      {
        $set: { active: false },
      },
      { returnDocument: "after" }
    );
    return result.value as User;
  }
}
