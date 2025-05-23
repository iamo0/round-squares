import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import GamesPage from './pages/games-page/games-page';
import GamePage from './pages/game-page/game-page';
import LoginPage from './pages/login-page/login-page';
import type { Game } from './types/game';

type RawGameResponse = {
  id: "string",
  start: "string",
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <GamesPage />,
    loader: async function() {
      const gamesResponse = await fetch(`http://localhost:50053/games`, {
        method: "GET",
      });

      if (gamesResponse.status !== 200) {
        throw new Error("");
      }

      const gamesList = (await gamesResponse.json()).map((g: RawGameResponse) => ({
        ...g,
        start: new Date(g.start),
      })) as Game[];

      return gamesList;
    }
  },
  {
    path: "/:gameId",
    element: <GamePage />,
    loader: async function({ params }) {
      const { gameId } = params;
      const gameResponse = await fetch(`http://localhost:50053/games/${gameId}`, {
        method: "GET",
      });

      if (gameResponse.status !== 200) {
        return redirect("/404");
      }

      const gameToDisplay = await gameResponse.json();

      return {
        ...gameToDisplay,
        start: new Date(gameToDisplay.start),
      } as Game;
    },
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/404",
    element: <>Игра не найдена</>,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
