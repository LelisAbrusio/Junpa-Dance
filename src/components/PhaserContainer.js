import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import BootScene from '../phaser/scenes/BootScene';
import MainScene from '../phaser/scenes/MainScene';

const PhaserContainer = () => {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'phaser-game',
            scene: [BootScene, MainScene]
        };

        gameRef.current = new Phaser.Game(config);

        return () => gameRef.current.destroy(true);
    }, []);

    return <div id="phaser-game-container"><div id="phaser-game" /></div>;
};

export default PhaserContainer;
