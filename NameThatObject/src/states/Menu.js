import Phaser from 'phaser'

var about;

export default class extends Phaser.State {

  init() {

    //  Horizontal alignment
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.refresh();

    //  About information text
    about = game.add.text(this.world.centerX, this.world.centerY + 120,"Name that object: game made for Ubykuo   ", {font:"Bangers", fontSize: 22,fill:"#000",align:"center"});
    about.visible = false;
    about.anchor.setTo(0.5, 0.5);

  }

  preload () {
    //  Sprites
    game.load.image('volumeon', 'assets/images/volumeon.png');
    game.load.image('menubutton', 'assets/images/menubutton.png');
    game.load.image('whitesquare', 'assets/images/whitesquare.png');
    game.load.image('dog', 'assets/images/dog.png');
    game.load.image('house', 'assets/images/house.png');
    game.load.image('happycar', 'assets/images/happycar.png');

    //  Spritesheets
    game.load.spritesheet('letter','assets/images/alphabetspritesheet.png',150,212);

    //  Sounds
    game.load.audio('levelcompleted','assets/audio/levelcompleted.mp3');
    game.load.audio('error','assets/audio/error.mp3');
    game.load.audio('youwon','assets/audio/youwon.mp3');

    //  Music
    game.load.audio('musiclowq','assets/audio/musiclowq.mp3');

  }
  
  create () {

    var clickSound = game.add.audio('clicksound');
    //  Game title 
    var title = game.add.sprite(game.world.centerX,game.world.centerY-500 ,'gametitle');
    title.anchor.set(0.5);
    game.add.tween(title).to( { y: game.world.centerY-200 }, 2000, Phaser.Easing.Back.Out, true);

    //  Play button
    this.createButton(game, this.world.centerX, this.world.centerY, 200, 50, 'Play Game', function () { 
      clickSound.play();
      this.state.start('Game')});

    //  About button
    this.createButton(game, this.world.centerX, this.world.centerY + 60, 200, 50, 'About', function () {
      clickSound.play();
      about.visible ? about.visible = false : about.visible = true;
    });    
  }

  createButton(game, x , y, w, h, title, callback) {
    var button = game.add.button(x, y,'menubuttons', callback, this, 'over', 'up', 'over');
    button.anchor.setTo(0.5,0.5);
    button.height = h;
    button.width = w;
    var txt = game.add.text(button.x,button.y+3,title, {fontFamily:"Bangers", fontSize:16, fill:"#fff",align:"center"});
    txt.anchor.setTo(0.5,0.5);
  }
}