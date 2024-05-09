import React, { useState } from 'react';
import SplashScreen from './screens/SplashScreen';
import PhaserContainer from './screens/PhaserContainer';
import MainMenu from './screens/MainMenu';
import GameplayScreen from './screens/GameplayScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');

  const changeScreen = (screen) => setCurrentScreen(screen);

  return (
    <div className="App">
      {currentScreen === 'splash' && <SplashScreen goToMenu={() => changeScreen('mainmenu')} />}
      {currentScreen === 'mainmenu' && <MainMenu goToGameplay={() => changeScreen('gameplay')} />}
      {currentScreen === 'gameplay' && <PhaserContainer />}
    </div>
  );
};

export default App;
