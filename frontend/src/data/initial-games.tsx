import { GameState, type Game } from "../types/game";
import getRandom from "../helpers/get-random";

const DURATION = 1000 * 60;

const COOLDOWN = 1000 * 60;

export const initialGames: Array<Game> = new Array(5)
  .fill(null)
  .map((_item, i: number) => {
    const now = Date.now();
    const start = now + (Math.random() > 0.5 ? -1 : 1) * getRandom(0, 1000 * 60 * 5);

    return {
      end: new Date(start + DURATION),
      id: i.toString(),
      start: new Date(start),
      state: (
        (now >= start + DURATION + COOLDOWN ? GameState.ENDED : null) ||
        (now > start + DURATION && now < start + DURATION + COOLDOWN ? GameState.COOLDOWN : null) ||
        (now >= start && now < start + DURATION ? GameState.ACTIVE : null) ||
        GameState.WAITING
      ),
    };
  })
  .sort((a, b) => +a.start - +b.start);
