import "./game-result-page.css";

import { NavLink, useLoaderData } from "react-router-dom";

export default function GameResultPage() {
  const data = useLoaderData();

  return <>
    <main className="game-result">
      <h1>Игра закончена</h1>
      <div>
        Ваш результат: {data.points}
      </div>
      <NavLink to="/" className="game-result-exit">К списку игр</NavLink>
    </main>
  </>;
}
