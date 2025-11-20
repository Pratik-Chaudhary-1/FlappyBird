import { useEffect, useState } from "react";
import "./App.css";
import { GAME_CONFIG } from "./Config";
import { useKeyboard } from "./Hooks/useKeyboard";
import { useGamePhysics } from "./Hooks/useGamePhysics";
import Player from "./components/Player";
import Controls from "./components/Controls";
import Score from "./components/Score";
import Game from "./components/GameSpace";
import Obstacle from "./components/Obstacles";
import StartScreen from "./components/StartScreen";
import GameOverScreen from "./components/GameOverScreen";

const App = () => {
  const [playerY, setPlayerY] = useState(300);
  const [playerX, setPlayerX] = useState(100);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleJump = () => {
    if (!gameStarted) {
      setGameStarted(true);
    } else {
      setVelocity(GAME_CONFIG.jumpStrength);
    }
  };

  const resetGame = () => {
    setPlayerY(300);
    setPlayerX(100);
    setVelocity(0);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  const keysPressed = useKeyboard(gameOver, gameStarted, handleJump, resetGame);

  useGamePhysics(
    gameStarted,
    gameOver,
    playerY,
    playerX,
    velocity,
    obstacles,
    setPlayerY,
    setPlayerX,
    setVelocity,
    setObstacles,
    setScore,
    setGameOver,
    keysPressed
  );

  useEffect(() => {
    if (gameStarted && obstacles.length === 0) {
      setObstacles([
        {
          id: Date.now(),
          x: GAME_CONFIG.width,
          gapY:
            Math.random() * (GAME_CONFIG.height - GAME_CONFIG.gapSize - 200) +
            100,
        },
      ]);
    }
  }, [gameStarted, obstacles.length]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">Jump Game</h1>
        <Score score={score} />
      </div>

      <div
        className="game-box"
        style={{
          width: `${GAME_CONFIG.width}px`,
          height: `${GAME_CONFIG.height}px`,
        }}
      >
        <Game></Game>
        <Player x={playerX} y={playerY} size={GAME_CONFIG.playerSize}></Player>

        {obstacles.map((obs) => (
          <Obstacle
            key={obs.id}
            x={obs.x}
            gapY={obs.gapY}
            width={GAME_CONFIG.obstacleWidth}
            gameHeight={GAME_CONFIG.height}
            gapSize={GAME_CONFIG.gapSize}
          />
        ))}

        {!gameStarted && !gameOver && <StartScreen />}
        {gameOver && <GameOverScreen score={score} />}
      </div>

      <Controls></Controls>
    </div>
  );
};

export default App;
