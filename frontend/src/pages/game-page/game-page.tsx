import { NavLink, useLoaderData } from "react-router-dom";
import { useState } from "react";

export default function GamePage() {
  const game = useLoaderData();

  const [clicks, setClicks] = useState(0);

  function handleDuckClick() {
    setClicks(clicks + 1);
  }

  return <>
    <header className="game-header">
      <NavLink to="/" className="game-header-exit">Выйти</NavLink>
      <div className="game-header-status" title={game.id}>
        {game.state}
      </div>
      <div className="game-header-username">%username%</div>
    </header>
    <main className="game-round">
      <button onClick={handleDuckClick} className="game-round-clicker" style={{
        zoom: 3,
      }}>Click me!</button>
      <div className="game-round-stats">
        <div className="game-round-stats-state">{game.state}</div>
        <div className="game-round-stats-timer">00:00</div>
        <div className="game-round-stats-points">{clicks}</div>
      </div>
    </main>
  </>;
}
