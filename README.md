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



