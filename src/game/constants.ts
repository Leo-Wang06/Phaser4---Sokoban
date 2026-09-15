import type { Vec2 } from "./types";

/** 每个网格格子的像素尺寸 */
export const TILE_SIZE = 64;

/** 游戏画布尺寸 */
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

/** 各类元素颜色（demo 用纯色块区分） */
export const COLORS = {
  wall: 0x3b4252, // 深蓝灰：墙
  floor: 0xecf0f1, // 浅灰：地板（可走区域）
  goal: 0xf1c40f, // 黄：目标点标记
  box: 0xe67e22, // 橙：箱子
  player: 0x27ae60, // 绿：玩家
} as const;

/** 网格坐标 → 地图内像素坐标（左上角，不含屏幕偏移） */
export function gridToPixel(col: number, row: number): Vec2 {
  return { x: col * TILE_SIZE, y: row * TILE_SIZE };
}

/** 地图内像素坐标 → 网格坐标 */
export function pixelToGrid(x: number, y: number): Vec2 {
  return { x: Math.floor(x / TILE_SIZE), y: Math.floor(y / TILE_SIZE) };
}
