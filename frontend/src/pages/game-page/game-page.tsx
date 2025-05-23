import "./game-page.css";

import { NavLink, useFetcher, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import calculatePoints from "../../helpers/calculate-points";
import type { Click } from "../../types/click";
import { GameState, GameStateName, getGameCooldownTimestamp, getGameEndTimestamp, getGameState, type Game } from "../../types/game";

export default function GamePage() {
  const game = useLoaderData<Game>();
  const fetcher = useFetcher();

  const [clicks, setClicks] = useState<Click[]>([]);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [gameState, setGameState] = useState(getGameState(game));

  function cleanup() {
    clearInterval(timer);
    setTimer(undefined);
    setGameState(getGameState(game));
  }

  function updateTimestamp() {
    const currentGameState = getGameState(game);

    if (currentGameState === GameState.ENDED) {
      cleanup();
      return;
    }

    const nextTimestamp = [GameState.WAITING, GameState.COOLDOWN].includes(currentGameState)
      ? getGameCooldownTimestamp(game)
      : getGameEndTimestamp(game);

    setGameState(currentGameState);
    setTimeLeft(nextTimestamp - Date.now());
  }

  useEffect(function () {
    setTimer(setInterval(updateTimestamp, 1000));
    updateTimestamp();
    return cleanup;
  }, []);

  useEffect(function () {
    if (gameState !== GameState.ENDED) {
      return;
    }

    fetcher.submit(clicks, {
      method: "post",
      encType: "application/json",
    });
  }, [gameState]);

  function handleDuckClick() {
    if (getGameState(game) !== GameState.ACTIVE) {
      return;
    }

    setClicks([...clicks, {
      date: Date.now(),
    }]);
  }

  return <>
    <main className="game">
      <NavLink to="/" className="game-header-exit">Выйти</NavLink>
      <header className="game-header">
        <div className={`game-header-status game-header-status-${gameState}`} title={game.id}>
          {GameStateName.get(gameState)}
        </div>
        <div className="game-header-username">%username%</div>
      </header>
      <section className="game-round">
        <button
          disabled={[GameState.WAITING, GameState.COOLDOWN, GameState.ENDED].includes(gameState)}
          onClick={handleDuckClick}
          className="game-round-clicker"
        >Click me!</button>
        <div className="game-round-stats">
          <div className="game-round-stats-points">Очки: {calculatePoints(clicks)}</div>
          <div className="game-round-stats-timer">{
            (GameState.COOLDOWN === gameState ? "Начинаем через " : null) ||
            (GameState.ACTIVE === gameState ?   "До конца раунда "  : null) ||
            "Раунд завершен"
          }{[GameState.ACTIVE, GameState.COOLDOWN].includes(gameState) ? `00:${Math.round(timeLeft/1000) < 10 ? `0${Math.round(timeLeft/1000)}` : Math.round(timeLeft/1000)}` : null}</div>
        </div>
      </section>
    </main>
  </>;
}
