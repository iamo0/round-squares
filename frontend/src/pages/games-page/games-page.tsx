import "./games-page.css";

import { Form, NavLink, useLoaderData } from "react-router-dom";
import {
  type Game,
  GameState,
  GameStateName,
  getGameState,
  getGameCooldownTimestamp,
  getGameEndTimestamp,
} from "@round-square/shared";
import type { PropsWithChildren } from "react";

export default function GamesPage({ children }: PropsWithChildren) {
  const games = useLoaderData<Game[]>();

  return <section className="games">
    <Form method="POST" className="games-logout-form">
      <button className="games-logout" type="submit" name="logout" value="true">Выйти</button>
    </Form>

    {children}

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
  </section>;
};
