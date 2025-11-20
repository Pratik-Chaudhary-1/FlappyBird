import { useEffect, useRef } from "react";

export const useKeyboard = (gameOver, gameStarted, onJump, onRestart) => {
  const keysPressed = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && !gameStarted) {
        onJump();
        return;
      }

      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (!gameOver && gameStarted) {
          onJump();
        }
      }

      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        e.preventDefault();
        keysPressed.current[e.code] = true;
      }

      if (e.code === "KeyR" && gameOver) {
        onRestart();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        keysPressed.current[e.code] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver, gameStarted, onJump, onRestart]);

  return keysPressed;
};
