import Phaser from "phaser";
import { level1 } from "../data/levels";
import { Cell } from "../types";
import { parseLevel } from "../utils/level";

/**
 * 主游戏场景。
 * 步骤 3：先只验证关卡解析结果（控制台输出），不碰渲染。
 * 后续步骤会移除临时调试代码，改为渲染地图、处理输入和推箱子逻辑。
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    // 步骤 3（临时调试）：验证解析结果与关卡字符串一一对应
    const level = parseLevel(level1);
    console.log("boxes:", level.boxes);
    console.log("player:", level.player);
    console.log("grid:\n" + gridToString(level));

    // 步骤 2 的占位内容，暂时保留，确认场景仍存活
    this.add.rectangle(400, 300, 200, 120, 0x2ecc71, 1).setOrigin(0.5);

    // 一行提示文字
    this.add
      .text(400, 300, "GameScene 已启动", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "sans-serif",
      })
      .setOrigin(0.5);
  }
}

/** 临时调试：把静态 grid 还原成字符地图，方便和控制台里的关卡字符串对照 */
function gridToString(level: ReturnType<typeof parseLevel>): string {
  return level.grid
    .map((row) =>
      row
        .map((c) => (c === Cell.Wall ? "#" : c === Cell.Goal ? "." : " "))
        .join(""),
    )
    .join("\n");
}
