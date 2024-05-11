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

    const resize = () => {
      gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', resize);

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
  let arrows = [];
  const maxArrows = 3;
  const beatsPerMeasure = 4;
  

  const preload = function () {
    this.load.audio('danceTrack', 'assets/musics/danceTrack.mp3');
    this.load.image('rhythmBar', 'assets/images/rhythmBar.png');
    this.load.image('characterUI', 'assets/images/characterUI.png');
    this.load.image('background', 'assets/images/background.png');
    this.load.image('arrowUp', 'assets/images/arrowUp.png');
    this.load.image('arrowDown', 'assets/images/arrowDown.png');
    this.load.image('arrowLeft', 'assets/images/arrowLeft.png');
    this.load.image('arrowRight', 'assets/images/arrowRight.png');
    this.load.image('buttonA', 'assets/images/buttonA.png');
    this.load.image('buttonB', 'assets/images/buttonB.png');
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

    // Background
    this.add.image(400, 300, 'background');
  

    // Rhythm bar
    rhythmBar = this.add.image(400, 500, 'rhythmBar').setDisplaySize(800, 60);

    // Rectangle for flashing effect
    beatRectangle = this.add.rectangle(600, 500, 100, 100, 0xff0000);
    beatRectangle.setAlpha(0);

    this.sequence = 0;
    this.levelSequence = [
      [],
      ['arrowUp' ],
      ['arrowUp', 'arrowDown'],
      ['arrowUp', 'arrowDown', 'arrowUp'],
      ['arrowLeft', 'arrowRight', 'arrowDown'],
      ['arrowUp' ],
      ['arrowUp', 'arrowDown'],
      ['arrowUp', 'arrowDown', 'arrowDown'],
      ['arrowLeft', 'arrowRight', 'arrowDown'],
      ['arrowRight', 'arrowRight', 'arrowUp','arrowLeft'],
      ['arrowLeft', 'arrowRight', 'arrowDown','arrowLeft'],
      ['arrowUp' ],
      ['arrowUp', 'arrowDown'],
      ['arrowUp', 'arrowDown', 'arrowUp'],
      ['arrowLeft', 'arrowRight', 'arrowDown'],
      ['arrowUp' ],
      ['arrowUp', 'arrowDown'],
      ['arrowUp', 'arrowDown', 'arrowDown'],
      ['arrowLeft', 'arrowRight', 'arrowDown'],
      ['arrowRight', 'arrowRight', 'arrowUp','arrowLeft'],
      ['arrowLeft', 'arrowRight', 'arrowDown','arrowLeft'],
      ['arrowUp' ],
      ['arrowUp', 'arrowDown'],
      ['arrowUp', 'arrowDown', 'arrowUp'],
      ['arrowLeft', 'arrowRight', 'arrowDown'],
      ['arrowUp' ],
      ['arrowUp', 'arrowDown'],
      ['arrowUp', 'arrowDown', 'arrowDown'],
      ['arrowLeft', 'arrowRight', 'arrowDown'],
      ['arrowRight', 'arrowRight', 'arrowUp','arrowLeft'],
      ['arrowLeft', 'arrowRight', 'arrowDown','arrowLeft'],
    ];
    

    const arrowHeight = 60;
    const arrowImages = ['arrowUp', 'arrowDown', 'arrowLeft', 'arrowRight'];

    arrows = arrowImages.map((key) => {
      const arrow = this.add.image(0, 0, key).setVisible(false);
  
      // Scale the arrow proportionally to have a height of 60px
      const scale = arrowHeight / arrow.height;
      arrow.setScale(scale);
  
      return arrow;
    });

    let fourthBeatKey;
    const keyOptions = ['buttonA', 'buttonB'];

    // Add the fourth beat key UI, initially hidden
    fourthBeatKey = this.add.image(600, 500, keyOptions[0]).setVisible(true);

    // Scale the fourth beat key to the rhythm bar height
    const fourthKeyHeight = 60;
    const scale = fourthKeyHeight / fourthBeatKey.height;
    fourthBeatKey.setScale(scale);

    // Placeholder character information
    characterInfo = this.add.image(50, 300, 'characterUI');

    // Event listeners for the arrow keys
    this.input.keyboard.on('keydown-LEFT', () => handleArrowKeydown.call(this, 'left'), this);
    this.input.keyboard.on('keydown-RIGHT', () => handleArrowKeydown.call(this, 'right'), this);
    this.input.keyboard.on('keydown-UP', () => handleArrowKeydown.call(this, 'up'), this);
    this.input.keyboard.on('keydown-DOWN', () => handleArrowKeydown.call(this, 'down'), this);
    // Event listeners for key presses
    this.input.keyboard.on('keydown-A', (event) => handleKeydown('A'), this);
    this.input.keyboard.on('keydown-S', (event) => handleKeydown('S'), this);
    this.input.keyboard.on('keydown-Z', (event) => handleKeydown('Z'), this);
    this.input.keyboard.on('keydown-X', (event) => handleKeydown('X'), this);

    const handleArrowKeydown = function (key) {
      // Only consider the key press if arrow array has elements
      if (arrows.length > 0) {
        const firstArrow = arrows[0]; // First arrow object in the array
    
        // Map arrow keys to their corresponding arrow types
        const arrowMap = {
          'left': 'arrowLeft',
          'right': 'arrowRight',
          'up': 'arrowUp',
          'down': 'arrowDown'
        };
    
        // Check if the first arrow matches the key pressed
        if (firstArrow.texture.key === arrowMap[key]) {
          console.log(`${key} arrow key pressed, removing first arrow: ${firstArrow.texture.key}`);
          
          // Update score, remove the first arrow, and update display

          firstArrow.setVisible(false);
          arrows.shift(); // Remove from the array
        }
      }
    };

    const handleKeydown = (key) => {
      // Only consider the key press if it's the 4th beat
      if (this.hitOnFourth && arrows.length === 0) {
        console.log(`${key} key pressed exactly on the 4th beat!`);
        this.score += 1000;
        scoreText.setText('Score: ' + this.score);
        this.sequence++;
        this.hitOnFourth = false; // Reset the boolean after a correct hit
        fourthBeatKey.setVisible(false);
      }
    };
  
    const updateBeat = function () {
      beatIndex = (beatIndex + 1) % beatsPerMeasure;
    
      // On the first beat, create new arrows
      if (beatIndex === 0) {
        // Hide all existing arrows and generate a new set
        arrows.forEach((arrow) => arrow.setVisible(false));
    
        let newArrows = [];
        const possibleArrows = ['arrowUp', 'arrowDown', 'arrowLeft', 'arrowRight'];
        //const chosenArrows = Phaser.Utils.Array.Shuffle(possibleArrows).slice(0, maxArrows);
        const chosenArrows = this.levelSequence[this.sequence];

        console.log(chosenArrows)
    
        chosenArrows.forEach((arrowType, i) => {
          const x = 350 + i * 50;
          const newArrow = this.add.image(x, 500, arrowType).setVisible(true);
          const scale = 60 / newArrow.height;
          newArrow.setScale(scale);
          newArrows.push(newArrow);
        });
        
        arrows = newArrows;
        console.log(arrows)

        const randomKey = Phaser.Utils.Array.GetRandom(keyOptions);
    
        // Update the 4th beat key and make it visible
        
        setTimeout(() => {
          fourthBeatKey.setTexture(randomKey).setVisible(true);
        }, 10);
      }
    
      // Randomly change and show the key on the 4th beat
      if (beatIndex === 3) {
        this.hitOnFourth = true;
    
        setTimeout(() => {
          this.hitOnFourth = false;
          //fourthBeatKey.setTexture(randomKey).setVisible(true);
        }, 200);
    
        beatRectangle.setFillStyle(0x226622); // Green on the 4th beat
      } else {
        beatRectangle.setFillStyle(0x662222); // Red on other beats
      }
    
      // Flash the rectangle
      beatRectangle.setAlpha(1);
      this.time.delayedCall(200, () => beatRectangle.setAlpha(0));
    
      // Flash effect for HTML indicator
      if (beatIndicatorRef.current) {
        const flashClass = beatIndex === 3 ? 'flash-green' : 'flash-red';
        beatIndicatorRef.current.classList.add(flashClass);
        setTimeout(() => {
          beatIndicatorRef.current.classList.remove(flashClass);
        }, 300);
      }
    };
    
  
    // Timer to tick every 500 milliseconds (2 beats per second = 120 BPM)
    this.beatTimer = this.time.addEvent({
      delay: 500,
      callback: updateBeat,
      callbackScope: this,
      loop: true
    });
  
    
  
    // Score display
    scoreText = this.add.text(16, 16, 'Score: 0', {
      font: '32px Arial',
      fill: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: { x: 10, y: 5 },
      borderRadius: 5
    }).setScrollFactor(0).setDepth(100);
  
    
  
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
    <div id="phaser-game-container">
      <div id="phaser-game" />
      {/*<div ref={beatIndicatorRef} style={{ width: '100px', height: '100px', backgroundColor: '#fff' }}>
        Beat Indicator
      </div>*/}
    </div>
  );
};

export default PhaserContainer;
