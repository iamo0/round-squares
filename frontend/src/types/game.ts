export enum GameState {
  ACTIVE = "a",
  COOLDOWN = "cd",
  ENDED = "e",
  WAITING = "w",
};

export type Game = {
  end: Date,
  id: string,
  start: Date,
  state: GameState,
}
