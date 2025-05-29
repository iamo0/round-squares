import "./games-page.css";

import { NavLink, useFetcher, useLoaderData } from "react-router-dom";
import {
  type Game,
  GameState,
  GameStateName,
  getGameState,
  getGameCooldownTimestamp,
  getGameEndTimestamp,
} from "@round-square/shared";
import { useState } from "react";

export default function GamesPage() {
  const games = useLoaderData<Game[]>();
  const fetcher = useFetcher();

  const [isDialogShown, setIsDialogShown] = useState(false);

  return <section className="games">
    <dialog open={isDialogShown} className="newgame">
      <fetcher.Form method="POST" onSubmit={() => setIsDialogShown(false)}>
        <button className="newgame-close" type="button" onClick={() => setIsDialogShown(false)}>Закрыть</button>
        <h2 className="newgame-title">Начать новый раунд</h2>
        <div className="newgame-controls">
          <button type="submit" name="when" value="now">Прямо сейчас</button>
          <button type="submit" name="when" value="fiv">Через пять минут</button>
        </div>
      </fetcher.Form>
    </dialog>

    <button type="button" id="button" onClick={() => setIsDialogShown(true)}>Создать раунд</button>

    {games.map((g) => <article className={`games-item games-item-${getGameState(g)}`} key={`game-${g.id}`}>
      <NavLink to={`/${g.id}`} onClick={(evt) => {
        if ([GameState.WAITING].includes(getGameState(g))) {
          evt.preventDefault();
        }
      }}>
        <h2 className="games-item-id">Раунд #{g.id}</h2>
        <div className="games-item-state">{GameStateName.get(getGameState(g))}</div>
        <div className="games-item-timeframe">
          <div className="games-item-timeframe-start">Начало:&nbsp;{new Date(getGameCooldownTimestamp(g)).toLocaleTimeString("ru-RU")}</div>
          <div className="games-item-timeframe-end">Конец:&nbsp;{new Date(getGameEndTimestamp(g)).toLocaleTimeString("ru-RU")}</div>
        </div>
      </NavLink>
    </article>)}
  </section >;
};
