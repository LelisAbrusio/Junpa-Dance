import React, { useState } from 'react';
import SplashScreen from './screens/SplashScreen';
import MainMenu from './screens/MainMenu';
import GameplayScreen from './screens/GameplayScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');

  const changeScreen = (screen) => setCurrentScreen(screen);

  return (
    <div className="App">
      {currentScreen === 'splash' && (
        <SplashScreen goToMenu={() => changeScreen('menu')} />
      )}
      {currentScreen === 'menu' && (
        <MainMenu goToGameplay={() => changeScreen('gameplay')} />
      )}
      {currentScreen === 'gameplay' && <GameplayScreen goToMenu={() => changeScreen('menu')} />}
    </div>
  );
};

export default App;
