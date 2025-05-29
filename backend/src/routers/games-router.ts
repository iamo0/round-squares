import { Request, Response, Router } from "express";
import getRandom from "../helpers/get-random";
import calculatePoints, {
  GameState,
  getGameState,
  type Click,
  type Game,
} from "@round-square/shared";

function getNewGame(i: number, start: number): Game & { clicks: Click[] } {
  return {
    id: (i + 1).toString(),
    start: new Date(start),
    clicks: [] as Click[],
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

  gamesRouter.get("/", async function getGames(req: Request, res: Response) {
    res
      .status(200)
      .json(
        games
          .map(({ id, start }) => ({ id, start }))
          .sort((a, b) => +b.start - +a.start)
      );
  });

  gamesRouter.post("/", async function createGame(req: Request, res: Response) {
    const newGameStart = req.body.date;
    const newGame = getNewGame(games.length, newGameStart);
    games.push(newGame);

    const { id, start } = newGame;
    res.status(201).json({ id, start });
  });

  gamesRouter.get("/:gameId", async function getGame(req: Request, res: Response) {
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

    const { id, start } = game;
    res.status(200).json({ id, start });
  });

  gamesRouter.post("/:gameId", async function saveGave(req: Request, res: Response) {
    const { gameId } = req.params;
    const game = games.find((g) => g.id === gameId);

    if (game === undefined) {
      res.status(404).json({
        errors: [{
          message: `Can't find a game with id ${req.params.gameId}`,
        }],
      });
      return;
    }

    const { clicks }: {
      clicks: { date: string }[]
    } = req.body;

    game.clicks = [...game.clicks, ...clicks.map(({ date }): Click => ({
      date: +new Date(date),
    }))];

    res
      .status(201)
      .json({
        points: calculatePoints(game.clicks),
      });
  });

  gamesRouter.get("/:gameId/stats", async function getGameStats(req: Request, res: Response) {
    const { gameId } = req.params;
    const game = games.find((g) => g.id === gameId);

    if (game === undefined) {
      res.status(404).json({
        errors: [{
          message: `Can't find a game with id ${req.params.gameId}`,
        }],
      });
      return;
    }

    if (getGameState(game) !== GameState.ENDED) {
      res.status(400).json({
        errors: [{
          message: "Unable to return points for unfinished game",
        }],
      })
      return;
    }

    res.status(200).json({ 
      points: calculatePoints(game.clicks),
    });
  });

  return gamesRouter;
}
