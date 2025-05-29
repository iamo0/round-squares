import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider, type LoaderFunctionArgs } from 'react-router-dom';
import GamesPage from './pages/games-page/games-page';
import GamePage from './pages/game-page/game-page';
import LoginPage from './pages/login-page/login-page';
import { GameState, getGameState, type Game } from '@round-square/shared';
import GameResultPage from './pages/game-result-page/game-result-page';

type RawGameResponse = {
  id: "string",
  start: "string",
}

function Loader() {
  return <div style={{ textAlign: "center" }}>Loading...</div>;
}

function checkAuth() {
  return null;
}

function getProtectedLoader(
  checkFunction: (p: LoaderFunctionArgs) => any,
  loader: (p: LoaderFunctionArgs) => Promise<any>
) {
  return async function (p: LoaderFunctionArgs) {
    const result = checkFunction(p);
    if (result !== null) {
      return result;
    }

    return loader(p);
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <GamesPage />,
    loader: getProtectedLoader(checkAuth, async function gamesLoader() {
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
    }),
    action: async function gamesAction({ request }) {
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
    loader: getProtectedLoader(checkAuth, async function gameLoader({ params }) {
      const { gameId } = params;
      const gameResponse = await fetch(`http://localhost:50053/games/${gameId}`, {
        method: "GET",
      });

      if (gameResponse.status !== 200) {
        return redirect("/404");
      }

      const gameToDisplay = await gameResponse.json();
      const game = {
        ...gameToDisplay,
        start: new Date(gameToDisplay.start),
      } as Game;

      if (getGameState(game) === GameState.ENDED) {
        return redirect(`/${gameId}/result`);
      }

      return game;
    }),
    action: async function gameAction({ request, params }) {
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
    path: "/:gameId/result",
    element: <GameResultPage />,
    loader: getProtectedLoader(checkAuth, async function gameResultLoader({ params }) {
      const { gameId } = params;
      const gamePointsResponse = await fetch(`http://localhost:50053/games/${gameId}/stats`, {
        method: "GET",
      });

      if (gamePointsResponse.status !== 200) {
        throw new Error("");
      }

      return (await gamePointsResponse.json());
    }),
    HydrateFallback: Loader,
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
