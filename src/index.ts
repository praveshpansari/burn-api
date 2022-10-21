import express, { Application, Request, Response } from "express";

const app: Application = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello Typescript with Node.js!");
});

app.listen(PORT, (): void => {
  console.log(`Server running here https://localhost:${PORT}`);
});


