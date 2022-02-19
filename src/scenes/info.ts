import * as PIXI from 'pixi.js';
import Scene from '../types/scene';
import { Main } from '../main';
import Home from './home';

export default class Info extends Scene {
  private contentId: string;
  private movingGraphic: PIXI.Graphics;

  constructor(main: Main, contentId: string) {
    super(main);

    this.contentId = contentId;
  }

  async onStart(container) {
    // const response = await fetch(
    //   `https://cd-static.bamgrid.com/dp-117731241344/sets/${this.contentId}.json`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );

    this.movingGraphic = new PIXI.Graphics();
    this.movingGraphic.beginFill(0x00ff00);
    this.movingGraphic.drawRect(100, 100, 100, 100);

    this.movingGraphic.interactive = true;
    this.movingGraphic.on('click', (e) => {
      this.main.toScene(new Home(this.main));
    });

    // Add it to the stage to render
    container.addChild(this.movingGraphic);
  }

  async onDestroy() {}

  onUpdate(delta: number) {
    this.movingGraphic.rotation += delta / 100;
  }
}
