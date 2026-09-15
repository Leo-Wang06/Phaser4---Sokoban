import Phaser from "phaser";
import {
  COLORS,
  GAME_HEIGHT,
  GAME_WIDTH,
  TILE_SIZE,
  gridToPixel,
} from "../constants";
import { level1 } from "../data/levels";
import { Cell, type LevelData, type Vec2 } from "../types";
import { parseLevel } from "../utils/level";

/**
 * 主游戏场景。
 * 步骤 4：把静态网格（墙/地板/目标点）渲染成色块。
 * 后续步骤会在此基础上加入玩家、箱子和交互逻辑。
 */
export class GameScene extends Phaser.Scene {
  private level!: LevelData;
  /** 地图左上角在画布中的像素位置（用于居中） */
  private originX = 0;
  private originY = 0;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    // parseLevel解析level1的数据，返回LevelData
    this.level = parseLevel(level1);

    // 计算地图原点，使地图在画布中居中
    this.originX = (GAME_WIDTH - this.level.width * TILE_SIZE) / 2;
    this.originY = (GAME_HEIGHT - this.level.height * TILE_SIZE) / 2;

    this.renderGrid();
  }

  /** 网格坐标 → 画布像素坐标（左上角） */
  private cellToScreen(col: number, row: number): Vec2 {
    const p = gridToPixel(col, row);
    return { x: this.originX + p.x, y: this.originY + p.y };
  }

  /** 渲染静态网格（墙/地板/目标点） */
  private renderGrid(): void {
    const { grid } = this.level;

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const { x: px, y: py } = this.cellToScreen(x, y);

        switch (grid[y][x]) {
          case Cell.Wall:
            this.add
              .rectangle(px, py, TILE_SIZE, TILE_SIZE, COLORS.wall, 1)
              .setOrigin(0);
            break;

          case Cell.Floor:
            this.add
              .rectangle(px, py, TILE_SIZE, TILE_SIZE, COLORS.floor, 1)
              .setOrigin(0);
            break;

          case Cell.Goal:
            // 地板 + 中间叠一个黄色目标标记
            this.add
              .rectangle(px, py, TILE_SIZE, TILE_SIZE, COLORS.floor, 1)
              .setOrigin(0);
            this.add
              .rectangle(
                px + TILE_SIZE / 2,
                py + TILE_SIZE / 2,
                TILE_SIZE / 2,
                TILE_SIZE / 2,
                COLORS.goal,
                1,
              )
              .setOrigin(0.5)
              .setDepth(1);
            break;
        }
      }
    }
  }
}
