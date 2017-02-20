/* globals __DEV__ */
import Phaser from 'phaser'
 
var levels = [
	{
		birds : [
			{
				birdX : 100,
				birdY : 100	
			},{
				birdX : 200,
				birdY : 200		
			}		
		]
	}
];
 
var errorSound;
var levelCompletedSound;
var youWonSound;
var gameMusic;
 
var progress;
var level;
var levelText;
var stateText;
var birds;

export default class extends Phaser.State {
 
  init () { 
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.refresh();
  }
 
  create () {
    this.initializeProgress();
 
 
    this.levelText = game.add.text(60,30,' ', { font: '30px Bangers', fill: '#8fc25c' });
    this.levelText.visible = true;
    this.levelText.anchor.set(0.5);

 this.loadLevel();

	this.levelText.bringToTop();
/* 
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
 */
  }
 
  clickCheck() { 
/*    console.log('x: ' + game.input.mousePointer.x);
    console.log('y: ' + game.input.mousePointer.y);
 */
 
  }
 
  //  Find a better picture to test, both sides have differences in this picture (not good)
  loadLevel() {
	this.levelText.setText("Nivel: "+(level+1));
	this.levelText.visible = true;
	/*
    this.currentPicture = game.add.sprite(0,0,levels.pictures[level].picture);
    this.currentPicture.scale.setTo(scaleX,scaleY);
 
*/
	
	birds = this.game.add.group();
    
	for(var i = 0  ; i < levels[level].birds.length ; i++) {
 
      var birdInfo = levels[level].birds[i];
 
	  var bird = birds.create(birdInfo.birdX,birdInfo.birdY,'bird');
	  
	  var fly = bird.animations.add('fly');
	  
	  bird.animations.play('fly',15,true);
	  
      bird.events.onInputDown.add(this.birdClick, this);
    }
  }
 
  birdClick(bird) {
	//TODO do bird sound
/*    var sp = this.game.add.sprite(bird.x-offset,difference.y,difference.key);
 
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
  */
}

  showWinnerScreen(){
/*	stateText.visible = true;
	stateText.bringToTop();
  */
  }
 
  endOfGame (){
	  return (levels[level].length==(level+1));
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
//	return (progress==levels.pictures[level].differences.length);
  }
 
  //  Set the next level
  nextLevel() { 
 
  /*  level++;
    progress = 0;
 
    //  We change the image to name
    this.currentObject.loadLevel();
 
    //  Update the current level
  */
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