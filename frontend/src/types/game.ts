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
