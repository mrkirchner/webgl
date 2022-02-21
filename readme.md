# WebGL

## Prerequisites

- Node v16.14+ (LTS or Greater)
- Yarn

## Install Dependencies

### `yarn`

Install all dependencies of Application

### `yarn start`

Runs the app at [http://localhost:1234](http://localhost:1234)

## Controls

- Up: w or up
- Left: a or Left Arrow 
- Down: s or down arrow
- Right: d or right arrow
- Select: space or enter
- Back: esc or backspace

## Improvements

- Animations (Possibly animate )
- Better UI Tools (Possibly pixi-ui and layers )
- Null Culling
- Caching Purging
- Loading Data on Fly *Issue with loading data while scrolling
- Remove Hardcoded Numbers

## Known Issues

- Loading Data while scroll causes weird layout issues, could fix by refactoring animations or move to an animation library.
- Hack to handle url missing actual image, currently catching unhandled promise at window and checking error for url, should be using the built in loader but was having issues with texture not being returnd.