import * as PIXI from 'pixi.js';

import Scene from '../types/scene';
import { Main } from '../main';
import Info from './info';

export default class Home extends Scene {
  constructor(main: Main) {
    super(main);
  }

  async onStart(container) {
    // const response = await fetch(
    //   'https://cd-static.bamgrid.com/dp-117731241344/home.json',
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );

    const obj = new PIXI.Graphics();
    obj.beginFill(0xff0000);
    obj.drawRect(100, 100, 100, 100);

    obj.interactive = true;
    obj.on('click', (e) => {
      this.main.toScene(new Info(this.main, '1'));
    });

    // Add it to the stage to render
    container.addChild(obj);
  }

  async onDestroy() {}

  onUpdate(delta: number) {}
}
