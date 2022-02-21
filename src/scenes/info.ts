import * as PIXI from 'pixi.js';

import Scene from './scene';
import { Main } from '../main';
import Home from './home';
import { Content } from '../types/content';
import { TextStyle } from 'pixi.js';

export default class Info extends Scene {
  private keyboardEvent = (e) => this.onKeyboardDown(e);

  private content: Content;

  private isTransitioning: boolean = false;

  constructor(main: Main, content: Content) {
    super(main);

    this.alpha = 0;
    this.content = content;

    document.addEventListener('keydown', this.keyboardEvent);
  }

  async onInit() {
    const title =
      this.content.text?.title?.full?.series?.default?.content ||
      this.content.text?.title?.full?.program?.default?.content ||
      this.content.text?.title?.full?.default?.default?.content ||
      '';

    const url =
      this.content.image?.hero_collection['1.78']?.default?.default?.url ||
      this.content.image?.hero_collection['1.78']?.default?.default?.url ||
      this.content.image?.hero_collection['1.78']?.default?.default?.url ||
      this.content.image?.background['1.78']?.series?.default?.url ||
      this.content.image?.background['1.78']?.program?.default?.url ||
      this.content.image?.background['1.78']?.default?.default?.url ||
      this.content.image?.background_details['1.78']?.series?.default?.url ||
      this.content.image?.background_details['1.78']?.program?.default?.url ||
      this.content.image?.background_details['1.78']?.default?.default?.url ||
      '';

    let background;
    if (url) {
      // TODO Handle when url is invalid or bad data or missing
      background = PIXI.Sprite.from(url);
    }

    background.x = 0;
    background.y = 0;
    background.width = window.innerWidth;
    background.height = window.innerHeight;

    this.addChild(background);

    // Title
    const basicText = new PIXI.Text(
      title || 'Unknown',
      new TextStyle({
        fontFamily: 'Arial',
        fill: ['#ffffff'],
        fontSize: 48,
        fontWeight: 'lighter',
      })
    );
    basicText.x = 50;
    basicText.y = 50;
    this.addChild(basicText);

    // Title
    if (this.content?.ratings?.length) {
      const rating = new PIXI.Text(
        this.content?.ratings[0].value || 'Unknown',
        new TextStyle({
          fontFamily: 'Arial',
          fill: ['#ffffff'],
          fontSize: 24,
          fontWeight: 'lighter',
        })
      );
      rating.x = 55;
      rating.y = 100;
      this.addChild(rating);
    }
  }

  async onDestroy() {
    this.isTransitioning = true;

    document.removeEventListener('keydown', this.keyboardEvent);
  }

  onUpdate(delta: number) {
    if (this.alpha < 1) {
      this.alpha += 0.01;
    }
  }

  async onKeyboardDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'Escape':
      case 'Backspace':
        await this.main.toScene(new Home(this.main));
        break;
    }
  }
}
