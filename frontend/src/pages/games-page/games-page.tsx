import { NavLink } from "react-router-dom";
import { GameState } from "../../types/game";
import { useGames } from "../../data/games-provider";

const GameStateName = new Map([
  [GameState.ACTIVE, "Активен"],
  [GameState.COOLDOWN, "Cooldown"],
  [GameState.ENDED, "Раунд завершен"],
  [GameState.WAITING, "Раунд еще не начался"],
]);

export default function GamesPage() {
  const games = useGames();

  return <section className="games">
    {games.map((g) => <article className="games-item" key={`game-${g.id}`}>
      <NavLink to={`/${g.id}`}>
        <h2 className="games-item-id">{g.id}</h2>
        <div className="games-item-timeframe">
          <div className="games-item-timeframe-start">{g.start.toISOString()}</div>
          <div className="games-item-timeframe-end">{g.end.toISOString()}</div>
        </div>
        <div className="games-item-state">Статус: {GameStateName.get(g.state)}</div>
      </NavLink>
    </article>)}
  </section >;
};
