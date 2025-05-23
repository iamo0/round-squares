import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import GamesPage from './pages/games-page/games-page';
import GamePage from './pages/game-page/game-page';
import LoginPage from './pages/login-page/login-page';
import type { Game, RawGameResponse } from './types/game';

function Loader() {
  return <div style={{ textAlign: "center" }}>Loading...</div>;
}

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
    },
    action: async function({ request }) {
      const formData = await request.formData();
      const date = formData.get("when")! as string === "now"
        ? Date.now()
        : Date.now() + 1000 * 60 * 5;

      const newGameResponse = await fetch(`http://localhost:50053/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date }),
      });

      if (newGameResponse.status !== 201) {
        throw new Error("");
      }

      return (await newGameResponse.json());
    },
    HydrateFallback: Loader,
    shouldRevalidate: () => true,
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
    action: async function({ request, params }) {
      const { gameId } = params;
      const clicks = await request.json();

      const clicksResponse = await fetch(`http://localhost:50053/games/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clicks }),
      });

      if (clicksResponse.status !== 200) {
        throw new Error("");
      }

      const responseData = await clicksResponse.json();
      return responseData;
    },
    HydrateFallback: Loader,
    shouldRevalidate: () => true,
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
