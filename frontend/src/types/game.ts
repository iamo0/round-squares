export enum GameState {
  ACTIVE = "a",
  COOLDOWN = "cd",
  ENDED = "e",
  WAITING = "w",
};

export type Game = {
  id: string,
  start: Date,
}

export type RawGameResponse = {
  id: "string",
  start: "string",
}

export const GameStateName = new Map([
  [GameState.ACTIVE, "Активен"],
  [GameState.COOLDOWN, "Cooldown"],
  [GameState.ENDED, "Раунд завершен"],
  [GameState.WAITING, "Раунд еще не начался"],
]);

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
