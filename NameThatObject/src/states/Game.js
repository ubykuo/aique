/* globals __DEV__ */
import Phaser from 'phaser'

var levels = {
  words: [{
    name: 'perro',
    image: 'dog'
  }, {
    name: 'casa',
    image:'house'
  }, {
    name: 'auto',
    image: 'happycar',
  }]
};

const abc = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; // ñ?

var letters;
var boxes;
var currentSpritePosition;
var progress;
var level;
var currentObject;
var currentWordLength;
var errorSound;
var levelCompletedSound;
var youWonSound;
var gameMusic;
var levelText;
var stateText;

export default class extends Phaser.State {

  init () { 
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.refresh();
  }

  create () {

    //  Init physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Shuffle the levels
    this.shuffleLevels(levels);   

    //  Initialize the progress and level
    this.initializeProgress();

    //  We draw the object to name
    this.drawObject();

    //  Show the letter boxes that will contain the ordered dragged letters 
    this.createLetterBoxes();

    //  Show the draggable letters
    this.createLetters();    

    //  Sound definitions
    errorSound = game.add.audio('error');
    levelCompletedSound = game.add.audio('levelcompleted');
    youWonSound = game.add.audio('youwon');
    gameMusic = game.add.audio('musiclowq',1,true); //  Looped

    //  Congratulations text set
    /*stateText = game.add.text(this.world.centerX,540,'You Won!      ', { font: '50px Bangers', fill: '#000' });
    stateText.visible = false;
    stateText.anchor.set(0.5);*/

    levelText = game.add.text(this.world.centerX/8,20,'Level: '+ level + '   ', { font: '30px Bangers', fill: '#8fc25c' });
    levelText.visible = true;
    levelText.anchor.set(0.5);

    //  We decode the MP3 files
    game.sound.setDecodedCallback([errorSound, levelCompletedSound, youWonSound, gameMusic], this.soundSet, this);

  }

  //  We draw the letters and set them as draggable objects, scaling them now, making them snapable and giving them a real "name"
  createLetters() {
    this.letters = game.add.group();
    this.letters.physicsBodyType = Phaser.Physics.ARCADE;
    this.letters.enableBody = true;
    var letterCount = 0;
    for(var i = 0 ; i < 4 ; i++) {
      for(var j = 0; j < 7 ; j++) {
        var letter = this.letters.create(this.world.centerX + (57* j), 0 ,'letter',letterCount);
        letter.events.onDragStart.add(this.dragStart);
        letter.events.onDragStop.add(this.dragStop,this);
        letter.letterName = abc[letterCount]; //  We assign a real 'letter' to the object
        letter.scale.setTo(0.35,0.35);
        letter.inputEnabled = true;
        letter.input.enableDrag(false, true);

        game.add.tween(letter).to( { y: 105*i}, letterCount*50, Phaser.Easing.Quadratic.Out, true);

        letterCount++;

        if(letterCount == 26) //  We've drawn all the alphabet, so we stop 
          break; 
      }
    }
  }

  //  We create the boxes that will contain the dragged letters
  createLetterBoxes () {
    this.boxes = game.add.group();
    this.boxes.physicsBodyType = Phaser.Physics.ARCADE;
    this.boxes.enableBody = true;

    this.currentWordLength = levels.words[level].name.length; //  We update the word length of the current object 

    for(var i = 1 ; i <= this.currentWordLength ; i++) {
      var border = this.boxes.create((50*i), game.world.centerY*1.6 , 'whitesquare');
      var box = this.boxes.create   ((75*i), game.world.centerY*1.5 , 'whitesquare');

      box.tint = 0xe0e0e0;
      box.boxNumber = i; // We give the box a real number

      border.scale.setTo(1.0,1.2);
      border.tint = 0x93c6a3;
      border.alignIn(box, Phaser.CENTER, 0, 0);
    }
  }

  drawObject() {

    this.currentObject = game.add.sprite(0,25,levels.words[level].image);
    this.currentObject.scale.setTo(0.70,0.70)
  }

  //  When we start dragging a letter we save the old position in case we need to go back Marty 
  dragStart(currentSprite) { 
    console.log('Drag start: ' + currentSprite.x +  '  ' + currentSprite.y);
      currentSpritePosition = currentSprite.position.clone();
  }

  //  When we drop the letter in a box we check if its the right letter dropped in the right box
  dragStop (currentSprite) {

    if(game.physics.arcade.overlap(currentSprite, this.boxes, this.boxCollision, this.processHandler, this)) {
      currentSprite.input.disableDrag();
      progress++;
      if(progress == this.currentWordLength) {
        this.checkLevel();
      }
    } else {
      currentSprite.position.copyFrom(currentSpritePosition); //  Wrong letter/box! go back where you belong
      errorSound.play();
    }
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

  //  When we complete the word, we get a new word/level, if there are no more levels, congratulate the player
  checkLevel () {
    //  When we complete all the words, we win
    if(levels.words.length == level+1) {
      this.showCongratulations();
    } else {
      levelCompletedSound.play();
      game.time.events.add(Phaser.Timer.SECOND * 2, this.nextLevel, this);
    }   
  }

  //  Set the next level
  nextLevel() { 

    level++;
    progress = 0;

    //  We change the image to name
    this.currentObject.loadTexture(levels.words[level].image);

    // We kill the letter boxes and bring them back to life again
    this.boxes.removeAll();
    this.createLetterBoxes();

    //  We kill the letters and then we create them again (performance? save starting X,Y and re-sort?)
    this.letters.removeAll();
    this.createLetters(); 

    //  Enable all the boxes 
    this.boxes.setAll('body.enable', true);

    //  Update the current level
    levelText.setText('Level: '+ level + '   ');

  }

  //  We check if the right letter is going into the right box
  processHandler(letter, box) {
    var word = levels.words[level].name;
    console.log(box);
    if(word[box.boxNumber-1] == letter.letterName)
      return true;

    return false;
  }

  // Box vs. Letter collision
  boxCollision(currentSprite, box) {

    //  Align the letter in the center of the box
    game.add.tween(currentSprite.scale).to( {x:0.45,y:0.45}, 500, Phaser.Easing.Linear.InOut, true);
    currentSprite.alignIn(box, Phaser.TOP_LEFT, 0, 0);

    //  Redraw the letter in case we need to use it more than once
    this.redrawLetter(currentSprite);

    //  We disable the box when its filled
    box.body.enable = false;

    console.log(box);

    //console.log('Collision letter ' + currentSprite.letterName + ' with box number ' + box.boxNumber);
  }

  redrawLetter(currentLetter) {
   var letter = this.letters.create(currentSpritePosition.x, currentSpritePosition.y ,'letter',currentLetter.frame);
   letter.events.onDragStart.add(this.dragStart);
   letter.events.onDragStop.add(this.dragStop,this);
   letter.letterName = currentLetter.letterName; //  We assign the same letter
   letter.scale.setTo(0.35,0.35);
   letter.inputEnabled = true;
   letter.input.enableDrag(false, true);
   letter.alpha = 0;
   game.add.tween(letter).to( { alpha: 1}, 700, Phaser.Easing.Linear.None, true);
  }

  // Fisher-Yates (aka Knuth) shuffle algorithm
  shuffleLevels(sourceArray) { 

    for (var i = 0; i < sourceArray.words.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.words.length - i));

        var temp = sourceArray.words[j];
        sourceArray.words[j] = sourceArray.words[i];
        sourceArray.words[i] = temp;
    }
    return sourceArray;
  }

  initializeProgress() {
    level = 0;
    progress = 0;
  }

  soundSet() { 
    gameMusic.play();
    errorSound.volume = 0.20;
  }
}