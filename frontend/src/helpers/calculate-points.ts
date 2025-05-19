import type { Click } from "../types/click";

export default function calculatePoints(clicks: Click[]) {
  return clicks.reduce(function(acc:number, _click: Click, clickNumber: number) {
    const increment = clickNumber > 0 && (clickNumber + 1) % 11 === 0 ? 10 : 1;
    return acc + increment;
  }, 0);
}
