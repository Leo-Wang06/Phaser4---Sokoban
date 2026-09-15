/**
 * 静态网格单元格类型。
 * 玩家和箱子不写入 grid（见开发计划 3.1），grid 只存墙 / 地板 / 目标点。
 *
 * 用 `as const` 对象 + 联合类型代替 enum：
 * 项目 tsconfig 开了 `erasableSyntaxOnly`，enum 会生成运行时代码，无法通过编译。
 */
export const Cell = {
  Wall: "wall",
  Floor: "floor",
  Goal: "goal",
} as const;

export type Cell = (typeof Cell)[keyof typeof Cell];

/** 网格坐标：x 为列（横向），y 为行（纵向）。用 grid[y][x] 访问。 */
export interface Vec2 {
  x: number;
  y: number;
}

/** 解析后的关卡运行时结构 */
export interface LevelData {
  width: number;
  height: number;
  /** 静态网格，grid[y][x] */
  grid: Cell[][];
  /** 初始箱子位置 */
  boxes: Vec2[];
  /** 初始玩家位置 */
  player: Vec2;
}
