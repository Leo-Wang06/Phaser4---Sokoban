import Phaser from 'phaser';

/**
 * 创建 Phaser 游戏实例并挂载到传入的 DOM 容器上。
 * 步骤 1 暂不注册任何场景，只验证画布能正常显示。
 */
export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent,
    backgroundColor: '#1b1b1b',
  });
}
