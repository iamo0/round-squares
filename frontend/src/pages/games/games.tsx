import { useState } from "react";

enum GameState {
  ACTIVE = "a",
  COOLDOWN = "cd",
  ENDED = "e",
  WAITING = "w",
};

type Game = {
  end: Date,
  id: string,
  start: Date,
  state: GameState,
}

const GameStateName = new Map([
  [GameState.ACTIVE, "Активен"],
  [GameState.COOLDOWN, "Cooldown"],
  [GameState.ENDED, "Раунд завершен"],
  [GameState.WAITING, "Раунд еще не начался"],
]);

function getRandom(min: number, max: number) {
  return Math.round(min + (Math.random() * (max - min)));
}

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

export default function Games() {
  const [games,] = useState(initialGames);

  return <section className="games">
    {games.map((g) => <article className="games-item" key={`game-${g.id}`}>
      <h2 className="games-item-id">{g.id}</h2>
      <div className="games-item-timeframe">
        <div className="games-item-timeframe-start">{g.start.toISOString()}</div>
        <div className="games-item-timeframe-end">{g.end.toISOString()}</div>
      </div>
      <div className="games-item-state">Статус: {GameStateName.get(g.state)}</div>
    </article>)}
  </section>;
};
