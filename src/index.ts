import "reflect-metadata";
import express, { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import { connect } from "./utils/db.util";
import { buildSchema } from "type-graphql";
import UserResolver from "./resolvers/user.resolver";
import { ApplicationContainer } from "./ApplicationContainer";

const app: Application = express();

const PORT = process.env.PORT || 8080;

connect()
  .then(async () => {
    const schema = await buildSchema({
      resolvers: [UserResolver],
      container: ApplicationContainer.createContainer(),
    });
    app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true }));

    app.listen(PORT, () => {
      console.log(`Server running here https://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
