import { ISwiperOptions } from "./interfaces/options";
import { IState } from "./interfaces/state";
import { linesAngle } from "./helpers/math";
import { Line } from "./interfaces/math";
import { renderStage } from "./views/stage";
import '../scss/swiper.scss';

export default class Swiper {
    options: ISwiperOptions = {
        nav: {
            arrows: true,
            dots: true,
        },
        margin: 20,
        swiping: false,
        maxSwipingVertAngle: 45,
    }
    state: IState = {
        currentItem: 0,
        el: null,
        style: null,
        stage: null,
        slideWidth: 0,
        initialized: false,
        theme: 'default',
        items: [],
        swiping: {
            startX: null,
            startY: null,
        },
    }
    selector: string = ''

    constructor(selector: string = '', options: ISwiperOptions = {}) {
        if (!selector) {
            return;
        }

        this.selector = selector;
        this.options = {
            ...this.options,
            ...options,
        };

        this.init();
    }

    attachEvents(): void {
        let resizeTimeout: NodeJS.Timeout | null = null;

        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }

            resizeTimeout = setTimeout(() => {
                this.init();
            }, 300);
        });
    }

    initNav() {
        if (!this.options.nav) {
            return;
        }

        // this.nav.addEventListener('click', (event: MouseEvent) => {
        //     let navBtn = (event.target as HTMLElement).closest('.slider__nav-btn');

        //     if (navBtn.classList.contains('prev') && this.currentItem === 0) {
        //         return;
        //     }

        //     if (navBtn.classList.contains('next') && this.currentItem === this.itemsCount - 1) {
        //         return;
        //     }

        //     this.currentItem += (navBtn.classList.contains('prev') ? -1 : 1);
        //     this.translateStage();
        // });
    }

    getEvent(e: MouseEvent | TouchEvent) {
        return (e as TouchEvent)?.changedTouches ? (e as TouchEvent).changedTouches[0]: e;
    }

    isSwipingAngleBig(e: MouseEvent): boolean {
        const cat: Line = [
            {x: this.state.swiping.startX, y: this.state.swiping.startY},
            {x: e.clientX, y: this.state.swiping.startY},
        ];
        const hyp: Line = [
            {x: this.state.swiping.startX, y: this.state.swiping.startY},
            {x: e.clientX, y: e.clientY}
        ];

        return linesAngle(cat, hyp) > this.options.maxSwipingVertAngle;
    }

    isSwiping(): boolean {
        return !!this.state.swiping.startX;
    }

    swipeStart(event: MouseEvent) {
        // const e = this.getEvent(event);

        // const target = e.target.closest(this.itemSelector);

        // if (!target || (e.which && e.which !== 1)) {
        //     return;
        // }

        // event.preventDefault();

        // this.swipingState.startX = e.clientX;
        // this.swipingState.startY = e.clientY;
        // this.stage.classList.add('slider__stage_smooth');
    }

    swipeDrag(event: MouseEvent) {
        // const e = this.getEvent(event);
        // const target = e.target.closest(this.itemSelector);

        // if (!target || this.isSwipingAngleBig(e)) {
        //     return;
        // }

        // event.preventDefault();

        // target.setAttribute('data-locked', true);

        // const dx = e.clientX - this.swipingState.startX;
        // let translateX = this.calculateTranslate() - dx;
        // translateX = translateX > 0 ? '-' + translateX : -translateX;

        // this.stage.style.transform = 'translateX(' + translateX + 'px)';
    }

    swipeEnd (event: MouseEvent) {
        // const e = this.getEvent(event);
        // const target = e.target.closest(this.itemSelector);

        // if (!target || this.isSwipingAngleBig(e)) {
        //     return;
        // }

        // event.preventDefault();

        // this.stage.classList.remove('slider__stage_smooth');

        // const dx = Math.sign(e.clientX - this.swipingState.startX);

        // const translateCondition = (this.currentItem < this.itemsCount - 1 && dx < 0) || (this.currentItem > 0 && dx > 0);

        // this.currentItem += translateCondition ? -dx : 0;
        // this.translateStage();

        // this.swipingState = {startX: null, startY: null};

        // setTimeout(function () {
        //     target.removeAttribute('data-locked');
        // }, 500);
    }

    attachSwipingEvents() {
        // const context = this;

        // this.el.addEventListener('mousedown', function (e) { context.swipeStart(e); });
        // this.el.addEventListener('touchstart', function (e) { context.swipeStart(e); });

        // this.el.addEventListener('mousemove', function (e) { if (context.isSwiping()) { context.swipeDrag(e); } });
        // this.el.addEventListener('touchmove', function (e) { if (context.isSwiping()) { context.swipeDrag(e); } });

        // this.el.addEventListener('mouseout', function (e) { if (context.isSwiping()) { context.swipeEnd(e); } });
        // this.el.addEventListener('mouseup', function (e) { if (context.isSwiping()) { context.swipeEnd(e); } });
        // this.el.addEventListener('touchend', function (e) { if (context.isSwiping()) { context.swipeEnd(e); } });
        // this.el.addEventListener('touchcancel', function (e) { if (context.isSwiping()) { context.swipeEnd(e); } });
    }

    switchSwiping() {
        // if (window.matchMedia('(max-width: 767.98px)').matches) {
        //     this.attachSwipingEvents();
        // }
    }

    initDots() {
        // if (!this.options.nav.dots) {
        //     return;
        // }

        // this.dots.addEventListener('click', function (event) {
        //     let dot = event.target.closest('.slider__dots-item');

        //     if (!dot) {
        //         return;
        //     }

        //     thisObject.currentItem = parseInt(dot.getAttribute('data-index'));
        //     thisObject.translateStage();
        // });
    }

    calculateTranslate(): number {
        return (this.state.slideWidth + this.options.margin) * this.state.currentItem;
    }

    translateStage() {
        this.state.stage.style.transform = `translateX(-${this.calculateTranslate()}px)`;
        this.changeActiveDot();
    }

    changeActiveDot() {
        // let activeDot = this.dots.querySelector('.slider__dots-item.active');

        // if (!activeDot) {
        //     return;
        // }

        // activeDot.classList.remove('active');
        // let dots = this.dots.querySelectorAll('.slider__dots-item');
        // dots[this.currentItem].classList.add('active');
    }

    setStyles() {
        this.state.stage = this.state.el.querySelector('.s-swiper__stage');
        this.state.slideWidth = parseFloat(this.state.style.getPropertyValue('width'));

        this.state.el.style.width = `${this.state.slideWidth}px`;

        for (let i = 0; i < this.state.items.length; i++) {
            (this.state.items[i] as HTMLElement).style.width = `${this.state.slideWidth}px`;
            (this.state.items[i] as HTMLElement).style.marginRight = `${this.options.margin}px`;
        }

        this.state.stage.style.width = `${(this.state.slideWidth + this.options.margin) * this.state.items.length}px`;
        this.state.stage.style.transform = `translateX(-${this.calculateTranslate()}px)`;
    }

    resetStyles() {
        this.state.el.removeAttribute('style');
        this.state.stage.removeAttribute('style');

        for (let i = 0; i < this.state.items.length; i++) {
            (this.state.items[i] as HTMLElement).removeAttribute('style');
        }
    }

    initNavigation(): void {
        
    }

    initState(): void {
        this.state.el = document.querySelector(this.selector);
        this.state.style = getComputedStyle(this.state.el);
        this.state.el.classList.add('s-swiper');

        const itemList = this.state.el.children;
        this.state.el.innerHTML = renderStage(itemList);
        this.state.items = this.state.el.querySelectorAll('.s-swiper__item');
    }

    init(): void {
        if (!this.state.initialized) {
            this.initState();
            this.initNavigation();

            this.attachEvents();
            this.state.initialized = true;
        } else {
            this.resetStyles();
        }

        this.setStyles();

        if (this.options.swiping) {
            this.switchSwiping();
        }
    }
};