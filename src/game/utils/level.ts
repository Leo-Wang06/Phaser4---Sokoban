import { Cell, type LevelData, type Vec2 } from "../types";

/**
 * 把关卡字符串解析成运行时结构（grid / boxes / player）。
 *
 * 校验规则：
 *  - 每行长度必须一致；
 *  - 玩家有且只有一个；
 *  - 目标点数量必须等于箱子数量（否则无解）。
 *
 * 关键：动态实体（箱子、玩家）从 grid 里剥离出来单独存储，grid 只留静态地形。
 */
export function parseLevel(rows: string[]): LevelData {
  // rows => levels的数组
  const height = rows.length;
  const width = rows[0].length;

  if (rows.some((row) => row.length !== width)) {
    throw new Error("关卡数据每行长度必须一致");
  }

  // 初始化 墙， 地板， 箱子， 玩家， 目标数量
  const grid: Cell[][] = [];
  const boxes: Vec2[] = [];
  let player: Vec2 | null = null;
  let goalCount = 0;

  // 循环遍历，对照表替换
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      const ch = rows[y][x];
      switch (ch) {
        case "#":
          row.push(Cell.Wall);
          break;
        case " ":
          row.push(Cell.Floor);
          break;
        case ".":
          row.push(Cell.Goal);
          goalCount++;
          break;
        case "$":
          row.push(Cell.Floor);
          boxes.push({ x, y });
          break;
        case "*":
          row.push(Cell.Goal);
          goalCount++;
          boxes.push({ x, y });
          break;
        case "@":
        case "+": {
          if (player) {
            throw new Error("关卡只能有一个玩家 (@ 或 +)");
          }
          const isOnGoal = ch === "+";
          row.push(isOnGoal ? Cell.Goal : Cell.Floor);
          if (isOnGoal) goalCount++;
          player = { x, y };
          break;
        }
        default:
          throw new Error(`未知的关卡字符: "${ch}"`);
      }
    }
    grid.push(row);
  }

  if (!player) {
    throw new Error("关卡必须包含一个玩家 (@ 或 +)");
  }

  if (goalCount !== boxes.length) {
    throw new Error(
      `目标点数量(${goalCount}) 必须等于箱子数量(${boxes.length})`,
    );
  }

  return { width, height, grid, boxes, player };
}
