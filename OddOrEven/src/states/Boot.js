import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.refresh();
    this.stage.backgroundColor = '#EDEEC9';
    this.fontsReady = true;
    this.fontsLoaded = this.fontsLoaded.bind(this);
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'Loading resouces', { font: '16px Arial', fill: '#000', align: 'center' });
    text.anchor.setTo(0.5, 0.5);

    this.load.image('loaderBg', './assets/images/loader-bg.png');
    this.load.image('loaderBar', './assets/images/loader-bar.png');
    this.load.image('gametitle', './assets/images/gametitle.png');
    this.load.atlas('menubuttons', './assets/images/bluesheet.png', './assets/images/bluesheet.json');
    this.load.audio('clicksound', './assets/audio/click.ogg');

  }

  render () {
    if (this.fontsReady) {
      this.state.start('Menu');
    }
  }

  fontsLoaded () {
    this.fontsReady = true;
  }

}
