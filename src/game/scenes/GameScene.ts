import Phaser from "phaser";

/**
 * 主游戏场景。
 * 步骤 2：先用一个色块 + 一行文字验证场景能启动、create() 能被调用。
 * 后续步骤会在此基础上渲染关卡、处理输入和推箱子逻辑。
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    // 中心画一个绿色色块，验证场景已启动
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
