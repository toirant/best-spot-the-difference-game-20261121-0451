// Twin Lanterns: the numbers every other module agrees on.
// One place for the canvas size, the panels, the clock and the scoring,
// so a tweak here moves the whole game at once.
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

export const PANEL_WIDTH = 560;
export const PANEL_HEIGHT = 360;
export const PANEL_Y = 108;
export const LEFT_PANEL_X = 40;
export const RIGHT_PANEL_X = 680;

export const HUD_HEIGHT = 72;
export const MESSAGE_Y = 512;
export const CONTROLS_Y = 668;

export const LEVEL_TIME_SECONDS = 150;
export const HINTS_PER_LEVEL = 3;
export const HINT_COST_SECONDS = 10;
export const MISS_COST_SECONDS = 5;
export const FIND_POINTS = 100;
export const TIME_BONUS_PER_SECOND = 5;
export const DIFFERENCES_PER_LEVEL = 7;

export const COLORS = {
  hud: '#1c2438',
  hudEdge: '#3a4666',
  frame: '#8a6b46',
  frameInner: '#5d4630',
  panelLabel: '#e8dcc3',
  title: '#ffd98a',
  text: '#f2ead8',
  muted: '#b9ac93',
  found: '#3ddc84',
  miss: '#ff5d5d',
  hint: '#ffd23d',
  timer: '#ffffff',
  timerLow: '#ff7a7a',
  button: '#2e6f5e',
  buttonEdge: '#57b894',
};
