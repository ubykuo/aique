/* globals __DEV__ */
import Phaser from 'phaser'

var levels = {
  pictures: [{
    description: 'test',
    picture:'piggy',
    amountOfDifferences: '3',
    differences: [
    {
      name: 'violetFlower',
      x: 702,
      y: 523,
      w: 50,
      h: 50
    }]
  }]
};

var errorSound;
var levelCompletedSound;
var youWonSound;
var gameMusic;

var progress;
var level;
var levelText;
var stateText;
var currentPicture;
var currentDifferences;
var floor;
var bmd;
var rectan;
export default class extends Phaser.State {

  init () { 
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.refresh();
  }

  create () {

    this.initializeProgress();

    this.loadLevel();

    //  Sound definitions
    errorSound = game.add.audio('error');
    levelCompletedSound = game.add.audio('levelcompleted');
    youWonSound = game.add.audio('youwon');
    gameMusic = game.add.audio('musiclowq',1,true); //  Looped

    //  Congratulations text set
    /*stateText = game.add.text(this.world.centerX,540,'You Won!      ', { font: '50px Bangers', fill: '#000' });
    stateText.visible = false;
    stateText.anchor.set(0.5);*/

   /* levelText = game.add.text(this.world.centerX/8,20,'Level: '+ level + '   ', { font: '30px Bangers', fill: '#8fc25c' });
    levelText.visible = true;
    levelText.anchor.set(0.5);*/

    //  We decode the MP3 files
    game.sound.setDecodedCallback([errorSound, levelCompletedSound, youWonSound, gameMusic], this.soundSet, this);

  }

  clickCheck() { 

  }

  //  Find a better picture to test, both sides have differences in this picture (not good)
  loadLevel() {
    this.currentPicture = game.add.sprite(0,0,levels.pictures[level].picture);
    this.currentPicture.scale.setTo(0.67,0.74);

    this.bmd = game.make.bitmapData(50, 50); // careful on the size, difference size? onInputDown bug and draw

    //for(var i = 0  ; i <= levels.pictures[level].differences ; i++) {

      var difference = levels.pictures[level].differences[0];

      this.currentDifferences = new Phaser.Rectangle(difference.x+(difference.x*0.49), 
      difference.y+(difference.y*0.35),difference.w,difference.h); // offset calculation due to scaling 
      this.bmd.copyRect(this.currentPicture, this.currentDifferences);
      this.bmd.generateTexture(difference.name);

      var sp = this.game.add.sprite(difference.x, difference.y,difference.name);

      sp.scale.setTo(0.67,0.74);

      sp.inputEnabled = true;
      sp.events.onInputDown.add(this.differenceClick, this);

  //  }
  }

  differenceClick(difference) {
    var sp = this.game.add.sprite(difference.x,difference.y,difference.key);

    sp.scale.setTo(0.67,0.74);

    sp.inputEnabled = true;
    game.add.tween(sp).to({x: difference.x/2-50}, 1000, Phaser.Easing.Quadratic.Out,true);
    sp.events.onInputDown.add(this.repeatDifference, this);

    console.log(difference);
    progress++; //  checkProgress
    difference.destroy(); // Destroy the original difference so we cant click it again or check 
  }

  repeatDifference () {
    console.log("You've already found this difference");
  }
  
  showCongratulations () {

    //  Show congratulations text
    //stateText.visible = true;

    // Music and sound fading in and out
    gameMusic.fadeOut(4000);  //  Fades out but doesnt stop(), so we set a timer
    game.time.events.add(Phaser.Timer.SECOND * 4, function () {gameMusic.stop()}, this);

    youWonSound.fadeIn(500);

    // Wait 4 seconds and show the menu
    game.time.events.add(Phaser.Timer.SECOND * 4, function () {this.state.start('Menu')}, this);
  }

  checkLevel () {
  }

  //  Set the next level
  nextLevel() { 

    level++;
    progress = 0;

    //  We change the image to name
    this.currentObject.loadTexture(levels.words[level].image);

    //  Update the current level
    levelText.setText('Level: '+ level + '   ');
  }

  initializeProgress() {
    level = 0;
    progress = 0;
  }

  soundSet() { 
    gameMusic.volume = 0.80;
    //gameMusic.play();
    errorSound.volume = 0.20;
  }
}