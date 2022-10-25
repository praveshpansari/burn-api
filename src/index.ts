import express, { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema";
import { connect } from "./utils/db.util";

const app: Application = express();

const PORT = process.env.PORT || 8080;

connect()
  .then(() => {
    app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true }));

    app.listen(PORT, () => {
      console.log(`Server running here https://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
