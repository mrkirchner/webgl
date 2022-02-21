import * as PIXI from 'pixi.js';

import Scene from './scenes/scene';
import Home from './scenes/home';

export class Main {
  public application: PIXI.Application;
  private currentScene: Scene;

  constructor(
    parent: HTMLElement,
    width: number,
    height: number,
    resolution: number
  ) {
    this.application = new PIXI.Application({
      width,
      height,
      resolution,
      backgroundColor: 0x1f2022,
      antialias: true,
      resizeTo: window,
    });
    parent.replaceChild(this.application.view, parent.lastElementChild);

    this.application.ticker.add((delta) => {
      this.update(delta);
    });

    this.toScene(new Home(this));
  }

  private update(delta: number): void {
    if (this.currentScene) {
      this.currentScene.onUpdate(delta);
    }
  }

  public async toScene(scene: Scene) {
    // Remove Existing Scene
    if (this.currentScene) {
      await this.currentScene.onDestroy();
      this.currentScene.destroy(true);

      this.application.stage.removeChildren();
    }

    await scene.onInit();
    this.application.stage.addChild(scene);

    this.currentScene = scene;
  }
}
