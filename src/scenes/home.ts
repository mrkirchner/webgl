import Scene from './scene';
import { Main } from '../main';
import Carousel from '../components/carousel';
import { Category } from '../types/category';
import Info from './info';

const CAROUSEL_HEIGHT = 275;
const SCROLL_SPEED = 5;

export default class Home extends Scene {
  private resizeEvent = () => this.onResize();
  private keyboardEvent = (e) => this.onKeyboardDown(e);

  private readonly carousels: Carousel[] = [];
  private readonly selectedCursor: [number, number] = [0, 0];

  private visibleRows: number;
  private visibleRowRange: [number, number];

  private scrollYTo: number = 0;
  private isTransitioning: boolean = false;

  constructor(main: Main) {
    super(main);

    this.position.set(20, 20);
    this.alpha = 0;

    this.carousels = [];
    this.selectedCursor = [0, 0];

    this.visibleRows = Math.ceil(window.innerHeight / (CAROUSEL_HEIGHT * 1.5));
    this.visibleRowRange = [0, this.visibleRows];

    window.addEventListener('resize', this.resizeEvent);
    document.addEventListener('keydown', this.keyboardEvent);
  }

  async onInit() {
    const response = await fetch('/api/home.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { data } = await response.json();

    // Filtering Out Section without any Items
    let categories = data?.StandardCollection?.containers;

    for (let i = 0; i < categories.length; i++) {
      let category: Category = categories[i];

      if (category?.set?.refId) {
        const refResponse = await fetch(
          `/api/sets/${category?.set?.refId}.json`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const { data } = await refResponse.json();
        category.set =
          data?.CuratedSet || data?.TrendingSet || data?.PersonalizedCuratedSet;
      }
      const carousel = new Carousel(category, i === 0 ? 0 : -1);
      carousel.position.set(0, i * CAROUSEL_HEIGHT);

      this.addChild(carousel);
      this.carousels.push(carousel);
    }
  }
  async onDestroy() {
    this.isTransitioning = true;

    document.removeEventListener('resize', this.onResize);
    document.removeEventListener('keydown', this.keyboardEvent);
  }

  onUpdate(delta: number) {
    if (this.alpha < 1) {
      this.alpha += 0.01;
    }

    if (!this.isTransitioning) {
      if (this.y && this.scrollYTo > 0) {
        const y = SCROLL_SPEED * delta;

        this.y += y;
        this.scrollYTo -= y;

        if (this.scrollYTo <= 0) {
          this.scrollYTo = 0;
        }
      } else if (this.y && this.scrollYTo < 0) {
        const y = SCROLL_SPEED * delta;

        this.y -= y;
        this.scrollYTo += y;

        if (this.scrollYTo >= 0) {
          this.scrollYTo = 0;
        }
      }

      for (const carousel of this?.carousels) {
        carousel?.onUpdate(delta);
      }
    }
  }
  async onKeyboardDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.onPreviousRow();
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.onNextColumn();
        break;
      case 'KeyS':
      case 'ArrowDown':
        await this.onNextRow();
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.onPreviousColumn();
        break;
      case 'Enter':
      case 'Space':
        await this.onSelect();
        break;
    }
  }
  onResize() {
    this.visibleRows = Math.ceil(window.innerHeight / 500);
    this.visibleRowRange = [
      this.visibleRowRange[0],
      this.visibleRowRange[0] + this.visibleRows,
    ];
  }

  onNextRow() {
    if (this.selectedCursor[0] + 1 < this.carousels.length) {
      this.carousels[this.selectedCursor[0]].reset();

      this.selectedCursor[0] = Math.min(
        this.visibleRowRange[1],
        this.selectedCursor[0] + 1
      );

      if (this.selectedCursor[0] >= this.visibleRowRange[1]) {
        this.visibleRowRange = [
          this.visibleRowRange[0] + 1,
          Math.max(this.visibleRows, this.visibleRowRange[1] + 1),
        ];
        this.scrollYTo -= CAROUSEL_HEIGHT;
      }

      this.carousels[this.selectedCursor[0]].setSelected(
        this.selectedCursor[1]
      );
    }
  }
  onPreviousRow() {
    if (this.selectedCursor[0] - 1 >= 0) {
      this.carousels[this.selectedCursor[0]].reset();

      this.selectedCursor[0] = Math.max(0, this.selectedCursor[0] - 1);

      if (this.selectedCursor[0] < this.visibleRowRange[0]) {
        this.visibleRowRange = [
          Math.max(0, this.visibleRowRange[0] - 1),
          Math.min(this.visibleRows, this.visibleRowRange[1] - 1),
        ];
        this.scrollYTo += CAROUSEL_HEIGHT;
      }

      this.carousels[this.selectedCursor[0]].setSelected(
        this.selectedCursor[1]
      );
    }
  }

  onNextColumn() {
    if (this.selectedCursor[0] < this.carousels.length) {
      this.selectedCursor[1] =
        this.carousels[this.selectedCursor[0]].onScrollRight();
    }
  }
  onPreviousColumn() {
    if (this.selectedCursor[0] < this.carousels.length) {
      this.selectedCursor[1] =
        this.carousels[this.selectedCursor[0]].onScrollLeft();
    }
  }

  async onSelect() {
    const content = this.carousels[this.selectedCursor[0]].onSelect();

    await this.main.toScene(new Info(this.main, content));
  }
}
