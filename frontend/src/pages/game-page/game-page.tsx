import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useGame } from "../../data/games-provider";

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = useGame(gameId!);

  if (gameId === undefined || game === null) {
    navigate("/404");
    return <></>;
  }

  function handleDuckClick() {

  }

  return <>
    <header className="game-header">
      <NavLink to="/" className="game-header-exit">Выйти</NavLink>
      <div className="game-header-status" title={gameId}>
        {game.state}
      </div>
      <div className="game-header-username">%username%</div>
    </header>
    <main className="game-round">
      <button onClick={handleDuckClick} className="game-round-clicker">Click me!</button>
      <div className="game-round-stats">
        <div className="game-round-stats-state">{game.state}</div>
        <div className="game-round-stats-timer">00:00</div>
        <div className="game-round-stats-points">123</div>
      </div>
    </main>
  </>;
}
