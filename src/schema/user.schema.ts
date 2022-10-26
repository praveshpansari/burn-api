import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { ObjectId } from "mongodb";
import { isPresent } from "ts-is-present";
import { getCollection } from "../utils/db.util";

const User = new GraphQLObjectType({
  name: "User",
  fields: {
    first_name: { type: GraphQLString, description: "First Name of the user" },
    last_name: { type: GraphQLString, description: "Last Name of the user" },
    email: { type: GraphQLString, description: "Email of the user" },
    created_at: { type: GraphQLString, description: "Created at Timestamp" },
    _id: { type: GraphQLID, description: "Id of the user" },
    password: { type: GraphQLString, description: "Password of the user" },
    updated_at: { type: GraphQLString, description: "Updated at Timestamp" },
    user_name: { type: GraphQLString, description: "Username" },
    active: { type: GraphQLBoolean, description: "Is the user active?" },
  },
});

export const UserSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      users: {
        type: new GraphQLList(User),
        resolve: async () =>
          (await getCollection().users.find().toArray()).map((user) => {
            return {
              ...user,
              created_at: new Date(
                user.created_at.getHighBits() * 1000
              ).toISOString(),
              updated_at: new Date(
                user.updated_at.getHighBits() * 1000
              ).toISOString(),
            };
          }),
      },
      user: {
        type: User,
        args: {
          _id: { type: GraphQLString },
        },
        resolve: async (_, { _id }) => {
          const user = await getCollection().users.findOne({
            _id: new ObjectId(_id),
          });
          return isPresent(user)
            ? {
                ...user,
                created_at: new Date(
                  user.created_at.getHighBits() * 1000
                ).toISOString(),
                updated_at: new Date(
                  user.updated_at.getHighBits() * 1000
                ).toISOString(),
              }
            : null;
        },
      },
    },
  }),
});

export default User;
