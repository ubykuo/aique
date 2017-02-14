/* globals __DEV__ */
import Phaser from 'phaser'

var letters;
var boxes;
var words = ['dog','house','car'];
var abc = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var currentSpritePosition;
var progress = 0;
var level = 0;
var levelImage = ['dog','house','happycar']; // Could also use the words variable if the names were the same
var currentObject;
var currentWordLength;
var stateText;
var errorSound;
var levelCompletedSound;
var youWonSound;

export default class extends Phaser.State {

  create () {

    // Init physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // We draw the object to name
    this.drawObject();

    // Show the letter boxes that will contain the ordered dragged letters 
    this.createLetterBoxes();

    // Show the draggable letters
    this.createLetters();    

    errorSound = game.add.audio('error');
    levelCompletedSound = game.add.audio('levelcompleted');
    youWonSound = game.add.audio('youwon');

    //  We decode the MP3 files
    game.sound.setDecodedCallback([errorSound, levelCompletedSound], this.soundSet, this);

  }

  // We draw the letters and set them as draggable objects, scaling them now, making them snapable and giving them a real "name"
  createLetters() {
    this.letters = game.add.group();
    this.letters.physicsBodyType = Phaser.Physics.ARCADE;
    this.letters.enableBody = true;
    var startingX, startingY;
    var letterCount = 0;
    for(var i = 0 ; i <= 4 ; i++) {
      for(var j = 0; j < 6 ; j++) {
        var letter = this.letters.create(120* j, 150* i ,'letter',letterCount);
        letter.events.onDragStart.add(this.dragStart);
        letter.events.onDragStop.add(this.dragStop,this);
        letter.letterName = abc[letterCount]; //  We assign a real 'letter' to the object
        letter.scale.setTo(0.45,0.45);
        letter.inputEnabled = true;
        letter.input.enableDrag(false, true);
        letter.input.enableSnap(100, 200, false, true); //  Alignment on drop 100x200 pixels (needs to be calculated)
        letterCount++;

        if(letterCount == 26) // We've drawn all the alphabet, so we stop 
          break; 
      }
    }
  }

  // We create the boxes that will contain the dragged letters
  createLetterBoxes () {
    this.boxes = game.add.group();
    this.boxes.physicsBodyType = Phaser.Physics.ARCADE;
    this.boxes.enableBody = true;

    this.currentWordLength = words[level].length; // We update the word length of the current object 

    for(var i = 1 ; i <= this.currentWordLength ; i++) {
      var box = this.boxes.create(800+(100*i), 450 , 'whitesquare');
      box.boxNumber = i; // We give the box a number
    }
  }

  drawObject() {
    this.currentObject = game.add.sprite(800,5,levelImage[level]);
  }

  // When we start dragging a letter we save the old position in case we need to go back Marty 
  dragStart(currentSprite) { 
    currentSpritePosition = currentSprite.position.clone();
  }

  // When we drop the letter in a box we check if its the right letter dropped in the right box
  dragStop (currentSprite) {

    if(game.physics.arcade.overlap(currentSprite, this.boxes, this.boxCollision, this.processHandler, this)) {
      currentSprite.input.disableDrag();
      progress++;
      if(progress == this.currentWordLength) {
        this.nextLevel();
      }
    } else {
      currentSprite.position.copyFrom(currentSpritePosition); //  Wrong letter/box! go back where you belong you letter!
      errorSound.play();
    }
  }

  showCongratulations () {
    stateText = game.add.text(960,540,'You Won!!      ', { font: '84px Bangers', fill: '#000' });
    youWonSound.play();
  }

  nextLevel () {
    if(words.length == level+1) {
      this.showCongratulations();
      return;
    }

    levelCompletedSound.play();

    level++;
    progress = 0;

    // We change the image to name
    this.currentObject.loadTexture(levelImage[level]);

     // We kill the letter boxes and bring them back to life again
    this.boxes.removeAll();
    this.createLetterBoxes();

    //  We kill the letters and then we create them again (performance? save starting X,Y and re-sort?)
    this.letters.removeAll();
    this.createLetters();   
  }

  // We check if the right letter is going into the right box
  processHandler(letter, box) {
    var word = words[level];

    if(word[box.boxNumber-1] == letter.letterName)
      return true;

    return false;

  }

  boxCollision(currentSprite, box) {
    console.log('Collision letter ' + currentSprite.letterName + ' with box number ' + box.boxNumber);
  }

  soundSet() { 

  }
}