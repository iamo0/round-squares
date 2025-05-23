import { Request, Response, Router } from "express";
import getRandom from "../helpers/get-random";

function getNewGame(i: number, start: number) {
  return {
    id: (i + 1).toString(),
    start: new Date(start),
  };
}

const games = new Array(5)
  .fill(null)
  .map((_item, i: number) => {
    const now = Date.now();
    const start = now + (Math.random() > 0.5 ? -1 : 1) * getRandom(0, 1000 * 60 * 5);

    return getNewGame(i, start);
  });


export default function initializeGameRouter(_sequelize: any) {
  const gamesRouter = Router();

  gamesRouter.get("/", async function (req: Request, res: Response) {
    res.status(200).json(games.sort((a, b) => +b.start - +a.start));
  });

  gamesRouter.post("/", async function (req: Request, res: Response) {
    const newGameStart = req.body.date;
    const newGame = getNewGame(games.length, newGameStart);
    games.push(newGame);
    res.status(201).json(newGame);
  });

  gamesRouter.get("/:gameId", async function (req: Request, res: Response) {
    const { gameId } = req.params;
    const game = games.find((g) => g.id === gameId);

    if (game === undefined) {
      res.status(404).json({
        errors: [{
          message: `Can't find a game with id ${req.params.gameId}`,
        }]
      });
      return;
    }

    res.status(200).json(game);
  });

  return gamesRouter;
}
