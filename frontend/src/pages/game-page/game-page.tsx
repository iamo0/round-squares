import { NavLink, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import calculatePoints from "../../helpers/calculate-points";
import type { Click } from "../../types/click";
import { GameState, GameStateName, type Game } from "../../types/game";
import { getGameEndTimestamp, getGameState } from "../../data/initial-games";

export default function GamePage() {
  const game = useLoaderData<Game>();

  const [clicks, setClicks] = useState<Click[]>([]);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [timer, setTimer] = useState<number|undefined>(undefined);
  const [gameState, setGameState] = useState(getGameState(game));

  useEffect(function() {
    setTimer(setInterval(function() {
      setGameState(getGameState(game));
      setTimeLeft(getGameEndTimestamp(game) - Date.now());
    }, 1000));

    return function() {
      clearInterval(timer);
      setTimer(undefined);
    }
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
      <button onClick={handleDuckClick} className="game-round-clicker" style={{
        zoom: 3,
      }}>Click me!</button>
      <div className="game-round-stats">
        <div className="game-round-stats-state">{GameStateName.get(gameState)}</div>
        <div className="game-round-stats-timer">{timeLeft}</div>
        <div className="game-round-stats-points">{calculatePoints(clicks)}</div>
      </div>
    </main>
  </>;
}
