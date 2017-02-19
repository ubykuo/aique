/* globals __DEV__ */
import Phaser from 'phaser'
 
var levels = {
  pictures: [{
    description: 'test',
    picture:'piggy',
    differences: [
    {
      name: 'violetFlower',
      x: 693,
      y: 523,
      w: 50,
      h: 50
    },
    {
      name: 'yellowApple',
      x: 530,
      y: 50,
      w: 70,
      h: 70
    },
	{
		name: 'mouth',
		x: 479,
		y: 343,
		w: 70,
		h: 40
	}
    ]
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
var bmd;
var differencesText;
 
const scaleX = 0.66;
const scaleY = 0.74;
const offset = 400;

export default class extends Phaser.State {
 
  init () { 
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.refresh();
  }
 
  create () {
 
    this.initializeProgress();
 
    this.differencesText = game.add.text(180,20,' ', { font: '30px Bangers', fill: '#8fc25c' });
    this.differencesText.visible = true;
    this.differencesText.anchor.set(0.5);

    this.loadLevel();

	this.differencesText.bringToTop();
 
    //  Sound definitions
    errorSound = game.add.audio('error');
    levelCompletedSound = game.add.audio('levelcompleted');
    youWonSound = game.add.audio('youwon');
    //gameMusic = game.add.audio('musiclowq',1,true); //  Looped
 
    //  Congratulations text set
    stateText = game.add.text(this.world.centerX,this.world.centerY,'You Won!      ', { font: '50px Bangers', fill: '#000' });
    stateText.visible = false;
    stateText.anchor.set(0.5);
 
    game.input.onTap.add(this.clickCheck, this);
 
    //  We decode the MP3 files
    game.sound.setDecodedCallback([errorSound, levelCompletedSound, youWonSound, gameMusic], this.soundSet, this);
 
  }
 
  clickCheck() { 
/*    console.log('x: ' + game.input.mousePointer.x);
    console.log('y: ' + game.input.mousePointer.y);
 */
 
  }
 
  //  Find a better picture to test, both sides have differences in this picture (not good)
  loadLevel() {
	this.differencesText.setText("Diferencias encontradas: "+progress+"/"+levels.pictures[level].differences.length);
	this.differencesText.visible = true;
	
    this.currentPicture = game.add.sprite(0,0,levels.pictures[level].picture);
    this.currentPicture.scale.setTo(scaleX,scaleY);
 
    for(var i = 0  ; i < levels.pictures[level].differences.length ; i++) {
 
      var difference = levels.pictures[level].differences[i];
 
      this.bmd = game.make.bitmapData(difference.w, difference.h); // careful on the size, difference size? onInputDown bug and draw
 
      this.currentDifferences = new Phaser.Rectangle(difference.x+(difference.x*0.515), 
        difference.y+(difference.y*0.35),difference.w,difference.h); // offset calculation due to scaling 
      this.bmd.copyRect(this.currentPicture, this.currentDifferences);
      this.bmd.generateTexture(difference.name);
 
      var sp = this.game.add.sprite(difference.x, difference.y,difference.name);
 
      sp.scale.setTo(scaleX,scaleY);
 
      sp.inputEnabled = true;
      sp.events.onInputDown.add(this.differenceClick, this);
    }
  }
 
  differenceClick(difference) {
    var sp = this.game.add.sprite(difference.x-offset,difference.y,difference.key);
 
    sp.scale.setTo(scaleX,scaleY);
 
    sp.inputEnabled = true;
    sp.alpha = 0;
    game.add.tween(sp).to({alpha:1}, 1000, Phaser.Easing.Quadratic.Out,true);
    sp.events.onInputDown.add(this.repeatDifference, this);
 
    console.log(difference);
    progress++; //  checkProgress
	this.differencesText.setText("Diferencias encontradas: "+progress+"/"+levels.pictures[level].differences.length);

    difference.destroy(); // Destroy the original difference so we cant click it again or check 

	if(this.endLevel()){
		if(!this.endOfGame()){
			this.nextLevel();			
		}else{
			this.showWinnerScreen();
			this.game.time.events.add(Phaser.Timer.SECOND * 4, function () {this.state.start('Menu')}, this);
		}
	}
  }

  showWinnerScreen(){
	stateText.visible = true;
	stateText.bringToTop();
  }
 
  endOfGame (){
	  return (levels.pictures.length==(level+1));
  }
 
  repeatDifference () {
    console.log("You've already found this difference");
  }
  
  showCongratulations () {
 
    //  Show congratulations text
    //stateText.visible = true;
 
    // Music and sound fading in and out
    gameMusic.fadeOut(4000);  //  Fades out but doesnt stop(), so we set a timer
    game.time.events.add(Phaser.Timer.SECOND * 4, function () {gameMusic.stop()}, this);
 
    youWonSound.fadeIn(500);
 
    // Wait 4 seconds and show the menu
    game.time.events.add(Phaser.Timer.SECOND * 4, function () {this.state.start('Menu')}, this);
  }
 
  endLevel () {
	return (progress==levels.pictures[level].differences.length);
  }
 
  //  Set the next level
  nextLevel() { 
 
    level++;
    progress = 0;
 
    //  We change the image to name
    this.currentObject.loadLevel();
 
    //  Update the current level
  }
 
  initializeProgress() {
    level = 0;
    progress = 0;
  }
 
  soundSet() { 
    //gameMusic.volume = 0.80;
    //gameMusic.play();
      }
}