## Installation:
```
npm i js-simple-swiper --save-dev
```

## Usage Example
### HTML
```
<div id="swiper">
    <img src="https://dummyimage.com/600x400/000/fff.jpg"/>
    <img src="https://dummyimage.com/600x400/000/fff.jpg"/>
    <img src="https://dummyimage.com/600x400/000/fff.jpg"/>
</div>
```
### CSS
Put this line into your javascript file:
```
import 'js-simple-swiper/dist/index.css';
```
Or this one into scss-file:
```
@import "~js-simple-swiper/dist/index.css";
```
### JS
```
import Swiper from 'js-simple-swiper';

new Swiper('#swiper');
```

### Options
It's possible to pass options as the second constructor's parameter:
```
new Swiper('#swiper', {
    stagePadding: 20,
});
```

|       Name        |  Type  |   Default Value             |      Description      |
|:------------------|:-------|:----------------------------|:----------------------|
| nav               | Object | {arrows: false,dots:false}  |  Enable arrows/dots for slide flipping. |
| margin            | Number | 20                          |  Space between items (px). |
| stagePadding      | Number | 30                          |  Stage's left and right padding (px). |
| swiping           | Boolean| false                       |  Enable flipping with touch or mouse button. |
| theme             | String | 'default'                   |  Theme name. [See](#custom-theme) how you can specify your own theme. |
| breakpoints       | Object | {768:{swiping:true}}        |  Describes option values for maximum window width (i. e. enable slide turning for window width < 768px). |
| maxSwipingVertAngle | Number | 45                          |  In case when slide flipping is enabled this option means angle's threshold between Y axis and the line which user swipes across the screen along. |


### Custom Theme
Put this code into css-/scss- file and set variable values:
```
.s-swiper.<theme_name> {
    --dot-width: 6px;
    --dot-height: 6px;
    --active-dot-width: 10px;
    --active-dot-height: 10px;
    --dot-color: rgba(0, 0, 0, 0.5);
    --active-dot-color: rgba(0, 0, 0, 1);
    --arrow-width: 30px;
    --arrow-height: 60px;
    --arrow-color: rgba(0, 0, 0, 0.5);
    --arrow-hover-color: rgba(0, 0, 0, 1);
}
```
Instead ```<theme_name>``` specify your theme's name.
Then set theme's name via constructor's options:
```
new Swiper('#swiper', {
    theme: '<theme_name>',
});
```
