import { GameState, type Game } from "../types/game";

const DURATION = 1000 * 60;

const COOLDOWN = 1000 * 60;

export function getGameState(game: Game) {
  const now = Date.now();
  const gameStart = +game.start;
  const gameCooldown = getGameCooldownTimestamp(game);
  const gameEnd = getGameEndTimestamp(game);

  return (
    (now >= gameStart && now < gameCooldown   ? GameState.COOLDOWN : null) ||
    (now >= gameCooldown && now < gameEnd     ? GameState.ACTIVE   : null) ||
    (now >= gameEnd                           ? GameState.ENDED    : null) ||
    GameState.WAITING
  );
}

export function getGameCooldownTimestamp(game: Game) {
  return +game.start + COOLDOWN;
}

export function getGameEndTimestamp(game: Game) {
  return +game.start + COOLDOWN + DURATION;
}
