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

export const GameStateName = new Map([
  [GameState.ACTIVE, "Активен"],
  [GameState.COOLDOWN, "Cooldown"],
  [GameState.ENDED, "Раунд завершен"],
  [GameState.WAITING, "Раунд еще не начался"],
]);
