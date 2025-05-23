import { NavLink, useFetcher, useLoaderData } from "react-router-dom";
import { GameStateName, getGameCooldownTimestamp, getGameEndTimestamp, getGameState, type Game } from "../../types/game";
import { useState } from "react";

export default function GamesPage() {
  const games = useLoaderData<Game[]>();
  const fetcher = useFetcher();

  const [isDialogShown, setIsDialogShown] = useState(false);

  return <section className="games">
    <dialog open={isDialogShown}>
      <fetcher.Form method="POST">
        <button type="button" onClick={() => setIsDialogShown(false)}>Закрыть</button>
        <h2>Начать новый раунд</h2>
        <button type="submit" name="when" value="now">Прямо сейчас</button>
        <button type="submit" name="when" value="fiv">Через пять минут</button>
      </fetcher.Form>
    </dialog>

    <button type="button" style={{
      zoom: 1.5,
    }} onClick={() => setIsDialogShown(true)}>Создать раунд</button>

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
