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
 * 步骤 5：渲染玩家并支持方向键 / WASD 移动，撞墙不能通过。
 * 后续步骤会加入箱子、推箱子逻辑和胜负判定。
 */
export class GameScene extends Phaser.Scene {
  private level!: LevelData;
  /** 地图左上角在画布中的像素位置（用于居中） */
  private originX = 0;
  private originY = 0;

  /** 玩家当前网格坐标 */
  private playerPos!: Vec2;
  /** 玩家的可视化矩形 */
  private playerRect!: Phaser.GameObjects.Rectangle;
  /** 方向键 */
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  /** WASD 键 */
  // Record<k, v> => { k: v }
  private wasdKeys!: Record<"w" | "a" | "s" | "d", Phaser.Input.Keyboard.Key>;
  /** 移动动画进行中，防止连续输入导致坐标与画面脱节 */
  private isMoving = false;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    // parseLevel解析level1的数据，返回LevelData
    this.level = parseLevel(level1);

    // 计算地图原点，使地图在画布中居中
    this.originX = (GAME_WIDTH - this.level.width * TILE_SIZE) / 2;
    this.originY = (GAME_HEIGHT - this.level.height * TILE_SIZE) / 2;

    // 玩家逻辑坐标取关卡初始位置
    this.playerPos = { ...this.level.player };

    // 初始化键盘输入（方向键 + WASD）
    const keyboard = this.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.wasdKeys = {
      w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // 执行渲染函数
    this.renderGrid();
    this.renderPlayer();
  }

  update(): void {
    if (this.isMoving) return;

    const { dx, dy } = this.readMoveInput();
    if (dx === 0 && dy === 0) return;

    // 修改玩家的网格坐标
    const nx = this.playerPos.x + dx;
    const ny = this.playerPos.y + dy;

    if (!this.canMoveTo(nx, ny)) return;

    this.movePlayer(nx, ny);
  }

  /** 读取方向键/WASD 输入，返回本次移动方向（单次触发） */
  private readMoveInput(): { dx: number; dy: number } {
    // JustDown 函数传入 key: Phaser.Input.Keyboard.Key 返回 布尔值
    const J = Phaser.Input.Keyboard.JustDown;
    // 初始化移动的dx dy
    let dx = 0;
    let dy = 0;

    if (J(this.cursors.left) || J(this.wasdKeys.a)) dx = -1;
    else if (J(this.cursors.right) || J(this.wasdKeys.d)) dx = 1;
    else if (J(this.cursors.up) || J(this.wasdKeys.w)) dy = -1;
    else if (J(this.cursors.down) || J(this.wasdKeys.s)) dy = 1;

    return { dx, dy };
  }

  /** 目标格是否可进入（不越界、不是墙） */
  private canMoveTo(col: number, row: number): boolean {
    // 防止元素被移出边界外
    if (col < 0 || row < 0 || col >= this.level.width || row >= this.level.height) {
      return false;
    }
    // 可移动到不为 wall 的目标元素
    return this.level.grid[row][col] !== Cell.Wall;
  }

  /** 把玩家移动到目标格（逻辑坐标立即更新，画面用 tween 平滑过渡） */
  private movePlayer(col: number, row: number): void {
    // 拿去计算后的玩家网格坐标
    this.playerPos = { x: col, y: row };
    this.isMoving = true;

    // 重新计算画布像素坐标
    const { x, y } = this.cellToScreen(col, row);
    // 调用 Tween 补间动画
    this.tweens.add({
      // 玩家的矩形
      targets: this.playerRect,
      // 目标值
      x,
      y,
      // 持续时间(ms)
      duration: 120,
      // 完成回调
      onComplete: () => {
        this.isMoving = false;
      },
    });
  }

  /** 网格坐标 → 画布像素坐标（左上角） */
  private cellToScreen(col: number, row: number): Vec2 {
    // 通过传入的网格坐标 x, y值，计算成画布像素的坐标
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

  /** 渲染玩家 */
  private renderPlayer(): void {
    const { x, y } = this.cellToScreen(this.playerPos.x, this.playerPos.y);
    this.playerRect = this.add
      .rectangle(x, y, TILE_SIZE, TILE_SIZE, COLORS.player, 1)
      .setOrigin(0)
      .setDepth(3);
  }
}
