const MainMenu = ({ goToGameplay }) => {
    return (
      <div className="splash-screen">
        <h1>Junpa Dance!</h1>
        <button onClick={goToGameplay}>Start</button>
      </div>
    );
  };
  
  export default MainMenu;
  