import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { ObjectId } from "mongodb";
import { collections } from "../utils/db.util";

const User = new GraphQLObjectType({
  name: "User",
  fields: {
    first_name: { type: GraphQLString, description: "First Name of the user" },
    last_name: { type: GraphQLString, description: "Last Name of the user" },
    email: { type: GraphQLString, description: "Email of the user" },
    created_at: { type: GraphQLString, description: "Timestamp" },
    _id: { type: GraphQLID, description: "Id of the user" },
  },
});

export const UserSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      users: {
        type: new GraphQLList(User),
        resolve: async () =>
          (await collections.users?.find().toArray())?.map((user) => {
            return {
              ...user,
              created_at: new Date(
                user.created_at.getHighBits() * 1000
              ).toISOString(),
            };
          }),
      },
      user: {
        type: User,
        args: {
          _id: { type: GraphQLString },
        },
        resolve: async (_, { _id }) =>
          await collections.users?.findOne({ _id: new ObjectId(_id) }),
      },
    },
  }),
});

export default User;
