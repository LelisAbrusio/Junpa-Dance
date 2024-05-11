export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
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
    }

    create() {
        this.scene.start('MainScene');
    }
}
