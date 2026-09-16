import type { Vec2 } from "./types";

/** 每个网格格子的像素尺寸 */
export const TILE_SIZE = 64;

/** 游戏画布尺寸 */
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

/** 网格坐标 → 地图内像素坐标（左上角，不含屏幕偏移） */
export function gridToPixel(col: number, row: number): Vec2 {
  return { x: col * TILE_SIZE, y: row * TILE_SIZE };
}

/** 地图内像素坐标 → 网格坐标 */
export function pixelToGrid(x: number, y: number): Vec2 {
  return { x: Math.floor(x / TILE_SIZE), y: Math.floor(y / TILE_SIZE) };
}
