const SplashScreen = ({ goToMenu }) => {
    return (
      <div className="splash-screen">
        <h1>Welcome to the Game!</h1>
        <button onClick={goToMenu}>Start</button>
      </div>
    );
  };
  
  export default SplashScreen;
  