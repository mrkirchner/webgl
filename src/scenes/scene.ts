import * as PIXI from 'pixi.js';
import { Main } from '../main';

export default abstract class Scene extends PIXI.Container {
  protected main: Main;

  protected constructor(main: Main) {
    super();

    this.main = main;

    this.main.application.ticker.add((delta) => {
      this.onUpdate(delta);
    });
  }

  abstract onInit(): Promise<void>;
  abstract onDestroy(): Promise<void>;

  abstract onUpdate(delta: number): void;
}
