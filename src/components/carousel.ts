import * as PIXI from 'pixi.js';
import { TextStyle } from 'pixi.js';
import Card from './card';
import { Category } from '../types/category';
import { UpdatableComponent } from '../types/updatableComponent';
import { Content } from '../types/content';

const CARD_WIDTH = 400;
const SCROLL_SPEED = 10;

export default class Carousel
  extends PIXI.Container
  implements UpdatableComponent
{
  public cards: Card[] = [];
  public selectedColumn = -1;

  private visibleColumns: number;
  private visibleColumnRange: [number, number];

  private scrollXTo: number = 0;

  constructor(category: Category, selected: number = -1) {
    super();

    this.cards = [];
    this.selectedColumn = selected;

    this.visibleColumns = Math.ceil(window.innerWidth / (350 * 1.75));
    this.visibleColumnRange = [0, this.visibleColumns];

    // Carousel Header
    const basicText = new PIXI.Text(
      category?.set?.text?.title?.full?.set?.default?.content || 'Unknown',
      new TextStyle({
        fontFamily: 'Arial',
        fill: ['#ffffff'],
        fontSize: 24,
        fontWeight: 'lighter',
      })
    );
    basicText.x = 20;
    basicText.y = 5;
    this.addChild(basicText);

    // Cards
    this.setCategory(category, selected);
  }

  public onUpdate(delta: number) {
    if (this.scrollXTo > 0) {
      const x = SCROLL_SPEED * delta;

      this.x += x;
      this.scrollXTo -= x;

      if (this.scrollXTo <= 0) {
        this.scrollXTo = 0;
      }
    } else if (this.scrollXTo < 0) {
      const x = SCROLL_SPEED * delta;

      this.x -= x;
      this.scrollXTo += x;

      if (this.scrollXTo >= 0) {
        this.scrollXTo = 0;
      }
    }

    for (const card of this.cards) {
      card.onUpdate(delta);
    }
  }

  public setCategory(category: Category, selected: number = -1) {
    // Cards
    const items = category?.set?.items || [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const card = new Card(item, i);
      card.position.set(i * CARD_WIDTH + 30, 50);

      if (i === selected) {
        card.setSelected(true);
      }

      this.addChild(card);
      this.cards.push(card);
    }
  }

  public setSelected(windowSelected: number): void {
    const selected = this.visibleColumnRange[0] + windowSelected;

    this.selectedColumn = selected;
    this.cards[this.selectedColumn].setSelected(true);
  }

  public onScrollRight(): number {
    if (this.selectedColumn + 1 < this.cards.length) {
      this.cards[this.selectedColumn].setSelected(false);

      this.selectedColumn = Math.min(
        this.visibleColumnRange[1],
        this.selectedColumn + 1
      );

      if (this.selectedColumn >= this.visibleColumnRange[1]) {
        this.visibleColumnRange = [
          this.visibleColumnRange[0] + 1,
          Math.min(
            this.cards.length - 1,
            this.visibleColumnRange[0] + 1 + this.visibleColumns
          ),
        ];

        this.scrollXTo = this.scrollXTo - 400;
      }
      this.cards[this.selectedColumn].setSelected(true);
    }

    let index = 0;
    for (
      let i = this.visibleColumnRange[0];
      i <= this.visibleColumnRange[1];
      i++
    ) {
      if (i === this.selectedColumn) {
        break;
      } else {
        index++;
      }
    }

    return index;
  }

  public onScrollLeft(): number {
    if (this.selectedColumn - 1 >= 0) {
      this.cards[this.selectedColumn].setSelected(false);

      this.selectedColumn = Math.max(0, this.selectedColumn - 1);

      if (this.selectedColumn < this.visibleColumnRange[0]) {
        this.visibleColumnRange = [
          this.visibleColumnRange[0] - 1,
          this.visibleColumnRange[0] - 1 + this.visibleColumns,
        ];

        this.scrollXTo = this.scrollXTo + 400;
      }
      this.cards[this.selectedColumn].setSelected(true);
    }

    let index = 0;
    for (
      let i = this.visibleColumnRange[0];
      i <= this.visibleColumnRange[1];
      i++
    ) {
      if (i === this.selectedColumn) {
        break;
      } else {
        index++;
      }
    }

    return index;
  }

  public onSelect(): Content {
    return this.cards[this.selectedColumn].getContent();
  }

  public reset(): void {
    if (this.selectedColumn >= 0) {
      this.cards[this.selectedColumn].setSelected(false);
    }

    this.selectedColumn = -1;
  }
}
