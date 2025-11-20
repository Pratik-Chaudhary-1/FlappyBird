const StartScreen = () => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2 className="overlay-title">Welcome!</h2>
        <p className="overlay-text">Press "SPACE" to start</p>
        <p className="overlay-text">"SPACE / ↑" to jump</p>
        <p className="overlay-text">"← →" to move horizontally</p>
      </div>
    </div>
  );
};

export default StartScreen;
