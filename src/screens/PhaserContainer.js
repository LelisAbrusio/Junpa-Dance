import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import './styles.css';

const PhaserContainer = () => {
  const gameRef = useRef(null);
  const beatIndicatorRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'phaser-game',
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current.destroy(true);
    };
  }, []);

  let scoreText;
  let rhythmBar;
  let characterInfo;
  let cursors;
  let actionKeys;
  let beatRectangle;
  let beatIndex = 0;
  const beatsPerMeasure = 4;

  const preload = function () {
    this.load.audio('danceTrack', '../assets/musics/danceTrack.mp3');
    this.load.image('rhythmBar', '../assets/images/rhythmBar.png');
    this.load.image('characterUI', '../assets/images/characterUI.png');
    this.load.image('background', '../assets/images/background.png');
  };

  const create = function () {
    // Initialize scores
    this.score = 0;
    this.rhythmScore = 0;
  
    // 4/4 beat state
    this.beatIndex = 0;
    this.beatsPerMeasure = 4;
    this.hitOnFourth = false;

    // Play dance audio track
    this.danceTrack = this.sound.add('danceTrack');
    this.danceTrack.play({ loop: true }); 
  
    // Rectangle for flashing effect
    beatRectangle = this.add.rectangle(700, 50, 100, 100, 0xff0000);
    beatRectangle.setAlpha(0);

    // Event listeners for key presses
    this.input.keyboard.on('keydown-A', (event) => handleKeydown('A'), this);
    this.input.keyboard.on('keydown-S', (event) => handleKeydown('S'), this);
    this.input.keyboard.on('keydown-Z', (event) => handleKeydown('Z'), this);
    this.input.keyboard.on('keydown-X', (event) => handleKeydown('X'), this);

    const handleKeydown = (key) => {
      // Only consider the key press if it's the 4th beat
      if (this.hitOnFourth) {
        console.log(`${key} key pressed exactly on the 4th beat!`);
        this.score += 1000;
        scoreText.setText('Score: ' + this.score);
        this.hitOnFourth = false; // Reset the boolean after a correct hit
      }
    };
  
    const updateBeat = function () {
      // Update to the next beat
      beatIndex = (beatIndex + 1) % beatsPerMeasure;
  
      // Flash red at beats 1-3, green on the 4th beat
      if (beatIndex === 3) {
        this.hitOnFourth = true;
        setTimeout(() => {
          this.hitOnFourth = false; // Reset after 200x  ms to enforce exact timing
        }, 200);
        beatRectangle.setFillStyle(0x00ff00); // Green on the 4th beat
        
      } else {
        beatRectangle.setFillStyle(0xff0000); // Red on other beats
      }
  
      // Flash the rectangle
      beatRectangle.setAlpha(1);
      this.time.delayedCall(200, () => beatRectangle.setAlpha(0));
  
      // Flash effect for the HTML indicator using CSS classes
      if (beatIndicatorRef.current) {
        const flashClass = beatIndex === 3 ? 'flash-green' : 'flash-red';
        beatIndicatorRef.current.classList.add(flashClass);
        setTimeout(() => {
          beatIndicatorRef.current.classList.remove(flashClass);
        }, 300); // Duration of the animation
      }
    };
  
    // Timer to tick every 500 milliseconds (2 beats per second = 120 BPM)
    this.beatTimer = this.time.addEvent({
      delay: 500,
      callback: updateBeat,
      callbackScope: this,
      loop: true
    });
  
    // Background
    this.add.image(400, 300, 'background');
  
    // Score display
    scoreText = this.add.text(16, 16, 'Total Score: 0\nRhythm Score: 0', {
      fontSize: '32px',
      fill: '#ffffff'
    });
  
    // Rhythm bar
    rhythmBar = this.add.image(400, 500, 'rhythmBar');
  
    // Placeholder character information
    characterInfo = this.add.image(50, 300, 'characterUI');
  
    // Input controls
    cursors = this.input.keyboard.createCursorKeys();
    actionKeys = this.input.keyboard.addKeys({
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      Z: Phaser.Input.Keyboard.KeyCodes.Z,
      X: Phaser.Input.Keyboard.KeyCodes.X
    });
  };

  const update = function () {
    // Check if it's the 4th beat
    /*if (beatIndex === 3 && this.hitOnFourth) {
      // Check if any of the action keys are pressed
      if (actionKeys.A.isPressed) {
        console.log("A key pressed on the 4th beat!");
        this.score += 1000;
        this.rhythmScore += 1000;
        this.hitOnFourth = false;
        scoreText.setText(
          'Total Score: ' + this.score + '\nRhythm Score: ' + this.rhythmScore
        );
      }

      if (actionKeys.S.isDown) {
        console.log("S key pressed on the 4th beat!");
      }

      if (actionKeys.Z.isDown) {
        console.log("Z key pressed on the 4th beat!");
      }

      if (actionKeys.X.isDown) {
        console.log("X key pressed on the 4th beat!");
      }
    }*/
  };

  return (
    <div>
      <div id="phaser-game" />
      <div ref={beatIndicatorRef} style={{ width: '100px', height: '100px', backgroundColor: '#fff' }}>
        Beat Indicator
      </div>
    </div>
  );
};

export default PhaserContainer;
