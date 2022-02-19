import * as PIXI from 'pixi.js';

import Scene from './types/scene';
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
      backgroundColor: 0x080808,
      antialias: true,
    });
    parent.replaceChild(this.application.view, parent.lastElementChild);

    this.application.ticker.add((delta) => {
      this.update(delta);
    });

    this.toScene(new Home(this)).then();
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
      this.application.stage.removeChildren();
    }

    // Create Container and Scene
    const container = new PIXI.Container();

    await scene.onStart(container);
    this.application.stage.addChild(container);

    this.currentScene = scene;
  }
}
