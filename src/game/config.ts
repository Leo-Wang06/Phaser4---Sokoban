import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

/**
 * 创建 Phaser 游戏实例并挂载到传入的 DOM 容器上。
 * MVP 阶段暂不需要 BootScene（不加载图片资源），直接注册 GameScene。
 */
export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent,
    backgroundColor: '#1b1b1b',
    scene: [GameScene],
  });
}
