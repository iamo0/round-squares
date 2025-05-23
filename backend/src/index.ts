import express, { Request, Response } from "express";
import cors from "cors";
import initializeGameRouter from "./routers/games-router";

const server = express();
const PORT = 50053; // ^_^

const sequelize = {};

server.use(cors());

server.use("/games", initializeGameRouter(sequelize));

server.use("/", function(req: Request, res: Response) {
  res
    .status(200)
    .json("Hello");
});

server.listen(PORT, function() {
  console.log(`Server is up at port ${PORT}`);
});
