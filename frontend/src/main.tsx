import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import GamesPage from './pages/games-page/games-page';
import GamePage from './pages/game-page/game-page';
import LoginPage from './pages/login-page/login-page';
import { initialGames } from './data/initial-games';

const router = createBrowserRouter([
  {
    path: "/",
    element: <GamesPage />,
    loader: async function() {
      return initialGames;
    }
  },
  {
    path: "/:gameId",
    element: <GamePage />,
    loader: async function({ params }) {
      const { gameId } = params;
      const gameToDisplay = initialGames.find((g) => g.id === gameId);

      if (gameToDisplay === undefined) {
        return redirect("/404");
      }

      return gameToDisplay;
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
