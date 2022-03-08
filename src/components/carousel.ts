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
  public id: string;
  public refId?: string;

  public cards: Card[] = [];
  public selectedCard = -1;

  private readonly visibleColumns: number;
  // Probably better to use interface instead of tuple for readablity
  private visibleColumnRange: [number, number];

  private scrollXTo: number = 0;
  private hasLoadedCards: boolean = false;

  constructor(category: Category, selected: number = -1) {
    super();

    this.id = category?.set?.setId;
    this.refId = category?.set?.refId;

    this.cards = [];
    this.selectedCard = selected;
    this.visibleColumns = Math.floor(window.innerWidth / CARD_WIDTH) - 1;
    this.visibleColumnRange = [0, this.visibleColumns];
    this.hasLoadedCards = false;

    this.onLoadCategoryTitle(category);
    this.onLoadCards(category);
  }

  onLoadCategoryTitle(category: Category) {
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
  }
  onLoadCards(category: Category, selected: number = -1) {
    const items = category?.set?.items || [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const card = new Card(item);
      card.position.set(i * CARD_WIDTH + 30, 50);

      if (i === selected) {
        card.setSelected(true);
      }

      this.addChild(card);
      this.cards.push(card);
    }

    if (this.cards?.length) {
      this.hasLoadedCards = true;
    }
  }
  onUpdate(delta: number) {
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

  setSelected(windowSelected: number): void {
    this.selectedCard = this.visibleColumnRange[0] + windowSelected;
    this.cards[this.selectedCard].setSelected(true);
  }

  onScrollRight(): number {
    if (this.selectedCard + 1 < this.cards.length) {
      this.cards[this.selectedCard].setSelected(false);

      this.selectedCard = Math.min(
        this.visibleColumnRange[1],
        this.selectedCard + 1
      );

      if (this.selectedCard >= this.visibleColumnRange[1]) {
        this.visibleColumnRange = [
          this.visibleColumnRange[0] + 1,
          Math.min(
            this.cards.length - 1,
            this.visibleColumnRange[0] + 1 + this.visibleColumns
          ),
        ];

        this.scrollXTo = this.scrollXTo - 400;
      }
      this.cards[this.selectedCard].setSelected(true);
    }

    let index = 0;
    for (
      let i = this.visibleColumnRange[0];
      i <= this.visibleColumnRange[1];
      i++
    ) {
      if (i === this.selectedCard) {
        break;
      } else {
        index++;
      }
    }

    return index;
  }
  onScrollLeft(): number {
    if (this.selectedCard - 1 >= 0) {
      this.cards[this.selectedCard].setSelected(false);

      this.selectedCard = Math.max(0, this.selectedCard - 1);

      if (this.selectedCard < this.visibleColumnRange[0]) {
        this.visibleColumnRange = [
          this.visibleColumnRange[0] - 1,
          this.visibleColumnRange[0] - 1 + this.visibleColumns,
        ];

        this.scrollXTo = this.scrollXTo + 400;
      }
      this.cards[this.selectedCard].setSelected(true);
    }

    let index = 0;
    for (
      let i = this.visibleColumnRange[0];
      i <= this.visibleColumnRange[1];
      i++
    ) {
      if (i === this.selectedCard) {
        break;
      } else {
        index++;
      }
    }

    return index;
  }
  onSelect(): Content {
    return this.cards[this.selectedCard].content;
  }

  reset(): void {
    if (this.selectedCard >= 0) {
      this.cards[this.selectedCard].setSelected(false);
    }

    this.selectedCard = -1;
  }

  async loadRefData(): Promise<void> {
    if (this?.refId && !this.hasLoadedCards) {
      const refResponse = await fetch(`/api/sets/${this.refId}.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { data } = await refResponse.json();

      await this.onLoadCards({
        set:
          data?.CuratedSet || data?.TrendingSet || data?.PersonalizedCuratedSet,
      });
    }
  }
}
