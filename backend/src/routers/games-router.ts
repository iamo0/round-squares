import { Request, Response, Router } from "express";
import getRandom from "../helpers/get-random";

const initialGames = new Array(5)
  .fill(null)
  .map((_item, i: number) => {
    const now = Date.now();
    const start = now + (Math.random() > 0.5 ? -1 : 1) * getRandom(0, 1000 * 60 * 5);

    return {
      id: i.toString(),
      start: new Date(start),
    };
  })
  .sort((a, b) => +b.start - +a.start);


export default function initializeGameRouter(_sequelize?: any) {
  const gamesRouter = Router();

  gamesRouter.get("/", async function (req: Request, res: Response) {
    res.status(200).json(initialGames);
  });

  gamesRouter.post("/", async function (req: Request, res: Response) {

  });

  return gamesRouter;
}
