// The three scenes in play order, easiest first. Each scene knows how to
// draw itself twice (original, then changed) and where its differences
// live, so the rest of the game never hard-codes a level.
import { harborScene } from './scenes/harbor.js';
import { gardenScene } from './scenes/garden.js';
import { atticScene } from './scenes/attic.js';

export const SCENES = [harborScene, gardenScene, atticScene];

/** The scene for a level index, wrapping past the last one. */
export function sceneForLevel(levelIndex) {
  return SCENES[levelIndex % SCENES.length];
}

/** A difference's hit zone, shifted into a panel's canvas position. */
export function zoneInPanel(difference, panelX, panelY) {
  return { x: panelX + difference.x, y: panelY + difference.y, r: difference.r };
}

/** The difference under a point in panel coordinates, or null. */
export function differenceAt(scene, panelX, panelY) {
  for (const difference of scene.differences) {
    const dx = panelX - difference.x;
    const dy = panelY - difference.y;
    if (dx * dx + dy * dy <= difference.r * difference.r) return difference;
  }
  return null;
}
