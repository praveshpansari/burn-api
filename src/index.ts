import "reflect-metadata";
import express, { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import { connect } from "./utils/db.util";
import { buildSchema } from "type-graphql";
import UserResolver from "./resolvers/user.resolver";
import { ApplicationContainer } from "./ApplicationContainer";
import AuthenticationResolver, { AuthPayload } from "./resolvers/auth.resolver";
import cors from "cors";

const app: Application = express();

const PORT = process.env.PORT || 8080;

connect()
  .then(async () => {
    const schema = await buildSchema({
      resolvers: [UserResolver, AuthenticationResolver],
      orphanedTypes: [AuthPayload],
      container: ApplicationContainer.createContainer(),
    });

    const server = graphqlHTTP((req, res) => {
      return {
        schema: schema,
        graphiql: { headerEditorEnabled: true },
        context: { req, res },
      };
    });
    app.use(cors());
    app.use("/graphql", server);

    app.listen(PORT, () => {
      console.log(`Server running here https://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
