import * as PIXI from 'pixi.js';
import { Main } from '../main';

export default abstract class Scene {
  protected main: Main;

  protected constructor(main: Main) {
    this.main = main;

    this.main.application.ticker.add((delta) => {
      this.onUpdate(delta);
    });
  }

  abstract onStart(container: PIXI.Container): Promise<void>;
  abstract onDestroy(): Promise<void>;

  abstract onUpdate(delta: number): void;
}
