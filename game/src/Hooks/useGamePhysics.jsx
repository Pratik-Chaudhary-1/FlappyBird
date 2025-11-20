import { GAME_CONFIG } from "../Config";

export const useGamePhysics = (
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
) => {
  const scoredObstacles = useRef(new Set());
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!gameStarted || gameOver) {
      return;
    }

    const gameLoop = () => {
      ////update player vertical position
      setVelocity((v) => v + GAME_CONFIG.gravity);
      setPlayerY((y) => {
        const newY = y + velocity;
        if (newY > GAME_CONFIG.height - GAME_CONFIG.playerSize) {
          setGameOver(true);
          return GAME_CONFIG.height - GAME_CONFIG.playerSize;
        }

        if (newY < 0) {
          return 0;
        }

        return newY;
      });

      //update player horizontal position
      setPlayerX((x) => {
        let newX = x;
        if (keysPressed.current["ArrowLeft"]) {
          newX = Math.max(0, x - GAME_CONFIG.moveSpeed);
        }
        if (keysPressed.current["ArrowRight"]) {
          newX = Math.min(
            GAME_CONFIG.width - GAME_CONFIG.playerSize,
            x + GAME_CONFIG.moveSpeed
          );
        }
        return newX;
      });

      //update obstacles
      setObstacles((prevObstacles) => {
        const updated = prevObstacles
          .map((obs) => ({
            ...obs,
            x: obs.x - GAME_CONFIG.obstacleSpeed,
          }))
          .filter((obs) => obs.x > -GAME_CONFIG.obstacleWidth);

        if (
          updated.length === 0 ||
          updated[updated.length - 1].x < GAME_CONFIG.width - 300
        ) {
          updated.push({
            id: Date.now(),
            x: GAME_CONFIG.width,
            gapY:
              Math.random() * (GAME_CONFIG.height - GAME_CONFIG.gapSize - 200) +
              100,
          });
        }
        return updated;
      });

      //check collisions and score
      setObstacles((prevObstacles) => {
        prevObstacles.forEach((obs) => {
          if (
            obs.X + GAME_CONFIG.obstacleWidth < playerX &&
            !scoredObstacles.current.has(obs.id)
          ) {
            scoredObstacles.current.add(obs.id);
            setGameOver((s) => s + 1);
          }

          if (
            playerX + GAME_CONFIG.playerSize > obs.x &&
            playerX < obs.x + GAME_CONFIG.obstacleWidth
          ) {
            if (
              playerY < obs.gapY ||
              playerY + GAME_CONFIG.playerSize > obs.gapY + GAME_CONFIG.gapSize
            ) {
              setGameOver(true);
            }
          }
        });
        return prevObstacles;
      });

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameStarted, gameOver, velocity, playerX, playerY, obstacles]);

  return scoredObstacles;
};
