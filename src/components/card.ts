import * as PIXI from 'pixi.js';
import { UpdatableComponent } from '../types/updatableComponent';
import { Content } from '../types/content';
import { IDestroyOptions } from 'pixi.js';

export default class Card extends PIXI.Container implements UpdatableComponent {
  private errorEvent = (e) => this.onError(e);

  private readonly content: Content;
  public isSelected: boolean;
  private scaleTo: number = 0;

  constructor(content) {
    super();

    window.addEventListener('unhandledrejection', this.errorEvent);
    this.content = content;

    const url =
      content.image.tile?.['1.78']?.series?.default?.url ||
      content.image.tile?.['1.78']?.program?.default?.url ||
      content.image.tile?.['1.78']?.default?.default?.url ||
      '';

    let sprite;
    if (url) {
      sprite = PIXI.Sprite.from(url);
    } else {
      sprite = PIXI.Sprite.from(require('../images/placeholder.jpg'));
    }

    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(0.75, 0.75);

    sprite.x = 190;
    sprite.y = 105;

    this.addChild(sprite);
  }

  onUpdate(delta: number) {
    let scale = 0.1 * delta;
    let sprite = this.getChildAt(0);

    if (this.scaleTo > 0) {
      sprite.scale.set(sprite.scale.x + scale, sprite.scale.y + scale);
      this.scaleTo = Math.min(0, this.scaleTo - scale);
    } else if (this.scaleTo < 0) {
      sprite.scale.set(sprite.scale.x - scale, sprite.scale.y - scale);
      this.scaleTo = Math.max(0, this.scaleTo + scale);
    }
  }

  destroy(_options?: IDestroyOptions | boolean) {
    super.destroy(_options);

    window.window.removeEventListener('unhandledrejection', this.errorEvent);
  }

  setSelected(selected: boolean) {
    if (selected) {
      this.scaleTo += 2.0;
    } else {
      this.scaleTo -= 2.0;
    }
    this.isSelected = selected;
  }

  getContent(): Content {
    return this.content;
  }

  // HACK to bypass Unhandled promise
  // Loader was not method was not returning texture, could use shared loaded would have to batch images
  onError(e) {
    const url =
      this.content.image?.tile?.['1.78']?.series?.default?.url ||
      this.content.image?.tile?.['1.78']?.program?.default?.url ||
      this.content.image?.tile?.['1.78']?.default?.default?.url ||
      '';

    if (e.reason.target.currentSrc.includes(url)) {
      let sprite: PIXI.Sprite = this.getChildAt(0) as PIXI.Sprite;

      sprite.texture = PIXI.Texture.from(require('../images/placeholder.jpg'));
      sprite.anchor.set(0.5, 0.5);
      sprite.scale.set(0.75, 0.75);
      sprite.x = 190;
      sprite.y = 105;
    }
  }
}
