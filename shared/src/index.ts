import { type Click } from "./types/click";
import calculatePoints from "./helpers/calculate-points";
import {
  type Game,
  GameState,
  GameStateName,
  getGameState,
  getGameCooldownTimestamp,
  getGameEndTimestamp
} from "./types/game";

export default calculatePoints;
export {
  type Click,
  type Game,
  GameState,
  GameStateName,
  getGameState,
  getGameCooldownTimestamp,
  getGameEndTimestamp,
};
