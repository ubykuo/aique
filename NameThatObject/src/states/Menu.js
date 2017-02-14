import Phaser from 'phaser'

var about;

export default class extends Phaser.State {

  init() {
    //  About information text
    about = game.add.text(this.world.centerX, this.world.centerY + 100,"Name that object: game made with Phaser for Ubykuo   ", {font:"Bangers", fontSize: 22,fill:"#000",align:"center"});
    about.visible = false;
    about.anchor.setTo(0.5, 0.5);
  }

  preload () {
    //  Images and sprites
    game.load.image('volumeon', 'assets/images/volumeon.png');
    game.load.image('menubutton', 'assets/images/menubutton.png');
    game.load.image('whitesquare', 'assets/images/whitesquare.png');
    game.load.image('dog', 'assets/images/dog.png');
    game.load.image('house', 'assets/images/house.png');
    game.load.image('happycar', 'assets/images/happycar.png');
    game.load.spritesheet('letter','assets/images/alphabetspritesheet.png',150,212);

    //  Sound
    game.load.audio('levelcompleted','assets/audio/levelcompleted.mp3');
    game.load.audio('error','assets/audio/error.mp3');
    game.load.audio('youwon','assets/audio/youwon.mp3')


    //  Music
  }
  
  create () {
    //  Play button
    this.createButton(game, this.world.centerX, this.world.centerY, 200, 50, 'Play Game', function () { 
      this.state.start('Game')});

    //  About button
    this.createButton(game, this.world.centerX, this.world.centerY + 50, 200, 50, 'About', function () {
      about.visible ? about.visible = false : about.visible = true;
    });    
  }

  createButton(game, x , y, w, h, title, callback) {
    var button = game.add.button(x, y,'menubutton', callback, this, 2, 1, 0);
    button.anchor.setTo(0.5,0.5);
    button.height = h;
    button.width = w;
    var txt = game.add.text(button.x,button.y,title, {font:"Bangers", fill:"#fff",align:"center"});
    txt.anchor.setTo(0.5,0.5);
  }
}