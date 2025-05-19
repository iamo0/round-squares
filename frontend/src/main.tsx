import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Games from './pages/games/games';
import Game from './pages/game/game';
import Login from './pages/login/login';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Games />,
  },
  {
    path: "/:gameId",
    element: <Game />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
