const GameplayScreen = ({ goToMenu }) => {
    return (
      <div className="splash-screen">
        <h1>Game screen</h1>
        <button onClick={goToMenu}>Go Back</button>
      </div>
    );
  };
  
  export default GameplayScreen;
  