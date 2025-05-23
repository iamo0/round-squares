import { NavLink, useLoaderData } from "react-router-dom";
import { GameStateName, getGameCooldownTimestamp, getGameEndTimestamp, getGameState, type Game } from "../../types/game";

export default function GamesPage() {
  const games = useLoaderData<Game[]>();

  return <section className="games">
    {games.map((g) => <article className="games-item" key={`game-${g.id}`}>
      <NavLink to={`/${g.id}`}>
        <h2 className="games-item-id">{g.id}</h2>
        <div className="games-item-timeframe">
          <div className="games-item-timeframe-start">{new Date(getGameCooldownTimestamp(g)).toLocaleTimeString("ru-RU")}</div>
          <div className="games-item-timeframe-end">{new Date(getGameEndTimestamp(g)).toLocaleTimeString("ru-RU")}</div>
        </div>
        <div className="games-item-state">Статус: {GameStateName.get(getGameState(g))}</div>
      </NavLink>
    </article>)}
  </section >;
};
