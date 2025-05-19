import { createContext, useContext, type PropsWithChildren } from "react";
import { GameState, type Game } from "../types/game";
import getRandom from "../helpers/get-random";

const DURATION = 1000 * 60;

const COOLDOWN = 1000 * 60;

const initialGames: Array<Game> = new Array(5)
  .fill(null)
  .map(() => {
    const now = Date.now();
    const start = now + (Math.random() > 0.5 ? -1 : 1) * getRandom(0, 1000 * 60 * 5);

    return {
      end: new Date(start + DURATION),
      id: Math.random().toString().slice(2),
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

const GamesContext = createContext<Game[]>([]);

export default function GamesProvider({ children }: PropsWithChildren) {
  return <GamesContext.Provider value={initialGames}>
    {children}
  </GamesContext.Provider>
};

export function useGames() {
  return useContext(GamesContext)
}

export function useGame(gameId: string) {
  const games = useContext(GamesContext);
  return games.find(({ id }) => id === gameId) || null;
}
