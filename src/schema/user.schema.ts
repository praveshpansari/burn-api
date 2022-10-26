import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType,
} from "graphql";
import UserResolver from "../resolvers/user.resolver";
import {
  GraphQLDateTime,
  GraphQLJSON,
  GraphQLJSONObject,
} from "graphql-scalars";
import { User } from "../models/user.model";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    first_name: { type: GraphQLString, description: "First Name of the user" },
    last_name: { type: GraphQLString, description: "Last Name of the user" },
    email: { type: GraphQLString, description: "Email of the user" },
    created_at: { type: GraphQLDateTime, description: "Created at Date" },
    _id: { type: GraphQLID, description: "Id of the user" },
    password: { type: GraphQLString, description: "Password of the user" },
    updated_at: { type: GraphQLDateTime, description: "Updated at Date" },
    user_name: { type: GraphQLString, description: "Username" },
    active: { type: GraphQLBoolean, description: "Is the user active?" },
  },
});

const Error = new GraphQLObjectType({
  name: "Error",
  fields: {
    type: { type: GraphQLString },
    message: { type: GraphQLString },
    code: { type: GraphQLInt },
    info: { type: GraphQLJSONObject },
    _id: { type: GraphQLID },
  },
});

const crudUser = new GraphQLUnionType({
  name: "CrudUser",
  types: [UserType, Error],
});

export const UserSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: async () => await UserResolver.getUsers(),
      },
      user: {
        type: UserType,
        args: {
          _id: { type: GraphQLString },
        },
        resolve: async (_, { _id }) => await UserResolver.getUser(_id),
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      user: {
        type: crudUser,
        args: {
          body: { type: GraphQLJSON },
        },
        resolve: async (_, { body }: { body: User }) =>
          UserResolver.createUser(body),
      },
      updateUser: {
        type: crudUser,
        args: { _id: { type: GraphQLID }, body: { type: GraphQLJSON } },
        resolve: async (_, { _id, body }: { _id: string; body: User }) =>
          UserResolver.updateUser(_id, body),
      },
      deleteUser: {
        type: crudUser,
        args: { _id: { type: GraphQLID } },
        resolve: async (_, { _id }) => UserResolver.deleteUser(_id),
      },
    },
  }),
});

export default UserType;
