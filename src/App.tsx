import { useEffect, useRef } from 'react';
import { createGame } from './game/config';
import './App.css';

function App() {
  // 承载 Phaser canvas 的容器
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = createGame(containerRef.current);

    // 卸载时销毁游戏，避免 StrictMode 双挂载 / HMR 时产生重复 canvas
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="game-container">
      <div ref={containerRef} />
    </div>
  );
}

export default App;
