import { NavLink, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import calculatePoints from "../../helpers/calculate-points";
import type { Click } from "../../types/click";
import { GameState, GameStateName, getGameCooldownTimestamp, getGameEndTimestamp, getGameState, type Game } from "../../types/game";

export default function GamePage() {
  const game = useLoaderData<Game>();

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

  function handleDuckClick() {
    if (getGameState(game) !== GameState.ACTIVE) {
      return;
    }

    setClicks([...clicks, {
      date: Date.now(),
    }]);
  }

  return <>
    <header className="game-header">
      <NavLink to="/" className="game-header-exit">Выйти</NavLink>
      <div className="game-header-status" title={game.id}>
        {GameStateName.get(gameState)}
      </div>
      <div className="game-header-username">%username%</div>
    </header>
    <main className="game-round">
      <button
        disabled={[GameState.WAITING, GameState.COOLDOWN, GameState.ENDED].includes(gameState)}
        onClick={handleDuckClick}
        className="game-round-clicker"
        style={{
          zoom: 3,
        }}
      >Click me!</button>
      <div className="game-round-stats">
        <div className="game-round-stats-state">{GameStateName.get(gameState)}</div>
        <div className="game-round-stats-timer" hidden={[GameState.ENDED].includes(gameState)}>{
          (GameState.ACTIVE === gameState ? "До конца раунда " : null) ||
          ("До начала раунда")
        }{timeLeft}</div>
        <div className="game-round-stats-points">{calculatePoints(clicks)}</div>
      </div>
    </main>
  </>;
}
