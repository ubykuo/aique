/* globals __DEV__ */
import Phaser from 'phaser'

var levels = {
  words: [{
    name: 'dog',
    image: 'dog'
  }, {
    name: 'house',
    image:'house'
  }, {
    name: 'car',
    image: 'happycar',
  }]
};

const abc = ['a','b','c','d','e','f','g','h','ih','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; // ñ?

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
var levelText;
var stateText;

export default class extends Phaser.State {

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

    //  Congratulations text set
    /*stateText = game.add.text(this.world.centerX,540,'You Won!      ', { font: '50px Bangers', fill: '#000' });
    stateText.visible = false;
    stateText.anchor.set(0.5);*/

    levelText = game.add.text(this.world.centerX+200,20,'Level: '+ level + '   ', { font: '30px Bangers', fill: '#8fc25c' });
    levelText.visible = true;
    levelText.anchor.set(0.5);

    //  We decode the MP3 files
    game.sound.setDecodedCallback([errorSound, levelCompletedSound, youWonSound], this.soundSet, this);
  }

  //  We draw the letters and set them as draggable objects, scaling them now, making them snapable and giving them a real "name"
  createLetters() {
    this.letters = game.add.group();
    this.letters.physicsBodyType = Phaser.Physics.ARCADE;
    this.letters.enableBody = true;
    var letterCount = 0;
    for(var i = 0 ; i <= 4 ; i++) {
      for(var j = 0; j < 6 ; j++) {
        var letter = this.letters.create(120* j, 0 ,'letter',letterCount);
        letter.events.onDragStart.add(this.dragStart);
        letter.events.onDragStop.add(this.dragStop,this);
        letter.letterName = abc[letterCount]; //  We assign a real 'letter' to the object
        letter.scale.setTo(0.45,0.45);
        letter.inputEnabled = true;
        letter.input.enableDrag(false, true);

        game.add.tween(letter).to( { y: 150*i }, (letterCount*50), Phaser.Easing.Quadratic.Out, true);

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
      var border = this.boxes.create(800+(100*i), 450 , 'whitesquare');
      var box = this.boxes.create(800+(100*i), 450 , 'whitesquare');

      box.tint = 0xe0e0e0;
      box.boxNumber = i; // We give the box a real number

      border.scale.setTo(1.3,1.2);
      border.tint = 0x93c6a3;
      border.alignIn(box, Phaser.CENTER, 0, 0);
    }
  }

  drawObject() {
    this.currentObject = game.add.sprite(800,5,levels.words[level].image);
  }

  //  When we start dragging a letter we save the old position in case we need to go back Marty 
  dragStart(currentSprite) { 
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

    youWonSound.play();

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

    levelText.setText('Level: '+ level + '   ');

  }

  //  We check if the right letter is going into the right box
  processHandler(letter, box) {
    var word = levels.words[level].name;

    if(word[box.boxNumber-1] == letter.letterName)
      return true;

    return false;
  }

  boxCollision(currentSprite, box) {
    currentSprite.alignIn(box, Phaser.TOP_CENTER, 0, 0);
    //console.log('Collision letter ' + currentSprite.letterName + ' with box number ' + box.boxNumber);
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

  }
}