import { ISwiperOptions } from "./interfaces/options";
import { IState } from "./interfaces/state";
import { linesAngle } from "./helpers/math";
import { Line } from "./interfaces/math";
import { renderStage } from "./views/stage";
import { renderArrows, renderDots } from "./views/nav";
import { mergeObjects } from "./helpers/object";
import '../scss/swiper.scss';

export default class Swiper {
    options: ISwiperOptions = {
        nav: {
            arrows: true,
            dots: true,
        },
        margin: 20,
        stagePadding: 30,
        items: 1,
        swiping: true,
        maxSwipingVertAngle: 45,
        theme: 'default',
        breakpoints: {
            768: {
                swiping: true,
            }
        }
    }
    state: IState = {
        currentItem: 0,
        el: null,
        stage: null,
        inner: null,
        swiperWidth: 0,
        itemWidth: 0,
        initialized: false,
        items: [],
        swiping: {
            startX: null,
            startY: null,
        },
    }
    selector: string = ''

    constructor(selector: string = '', options: ISwiperOptions) {
        if (!selector) {
            return;
        }

        this.selector = selector;
        this.applyOptions(options);
        this.init();
    }

    applyOptions(options: ISwiperOptions = {}): void {
        mergeObjects(options, this.options);
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

        this.state.el.addEventListener('click', (event: MouseEvent) => {
            const dot = (event.target as HTMLElement).closest('.s-swiper__dot');

            if (!dot) {
                return;
            }

            this.state.currentItem = parseInt(dot.getAttribute('data-index'));
            this.translateStage();
        });

        this.state.el.addEventListener('click', (event: MouseEvent) => {
            const arrow = (event.target as HTMLElement).closest('.s-swiper__arrow');

            if (!arrow || arrow.classList.contains('disabled')) {
                return;
            }

            if ((arrow.classList.contains('prev') && this.state.currentItem === 0)
                || (arrow.classList.contains('next') && this.state.currentItem === this.state.items.length - 1)) {
                return;
            }

            this.state.currentItem += (arrow.classList.contains('prev') ? -1 : 1);
            this.translateStage();
        });
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

    calculateTranslate(): number {
        return (this.state.itemWidth + this.options.margin) * this.state.currentItem;
    }

    translateStage() {
        this.state.stage.style.transform = `translateX(-${this.calculateTranslate()}px)`;
        this.changeActiveDot();
        this.checkArrowAccess();
    }

    checkArrowAccess() {
        const prevArrow = this.state.el.querySelector('.s-swiper__arrow.prev');
        const nextArrow = this.state.el.querySelector('.s-swiper__arrow.next');
        prevArrow.classList[this.state.currentItem === 0 ? 'add' : 'remove']('disabled');
        nextArrow.classList[this.state.currentItem === this.state.items.length - 1 ? 'add' : 'remove']('disabled');
    }

    changeActiveDot() {
        const activeDot = this.state.el.querySelector('.s-swiper__dot.active');
        if (!activeDot) {
            return;
        }

        const dots = this.state.el.querySelectorAll('.s-swiper__dot');

        activeDot.classList.remove('active');
        dots[this.state.currentItem].classList.add('active');
    }

    setStyles() {
        this.state.stage = this.state.el.querySelector('.s-swiper__stage');
        this.state.inner.style.marginLeft = `${this.options.stagePadding}px`;
        this.state.inner.style.marginRight = `${this.options.stagePadding}px`;

        const elStyle = getComputedStyle(this.state.el);
        this.state.swiperWidth = parseFloat(elStyle.getPropertyValue('width'));
        this.state.itemWidth = this.state.swiperWidth - this.options.stagePadding * 2;
        this.state.el.style.setProperty('--stage-padding', `${this.options.stagePadding}px`);

        const dots = this.state.el.querySelector('.s-swiper__dots');

        if (dots) {
            this.state.el.style.paddingBottom = `${dots.scrollHeight}px`;
            this.state.el.style.setProperty('--dots-height', `${dots.scrollHeight}px`);
        }

        for (let i = 0; i < this.state.items.length; i++) {
            (this.state.items[i] as HTMLElement).style.width = `${this.state.itemWidth}px`;
            (this.state.items[i] as HTMLElement).style.marginRight = `${this.options.margin}px`;
        }

        this.state.stage.style.width = `${(this.state.itemWidth + this.options.margin) * this.state.items.length}px`;
        this.state.stage.style.transform = `translateX(-${this.calculateTranslate()}px)`;
    }

    resetStyles() {
        this.state.el.removeAttribute('style');
        this.state.stage.removeAttribute('style');
        this.state.inner.removeAttribute('style');

        for (let i = 0; i < this.state.items.length; i++) {
            (this.state.items[i] as HTMLElement).removeAttribute('style');
        }
    }

    initNavigation(): void {
        if (this.options.nav.dots) {
            renderDots(this.state.el, this.state.items.length);
        }

        if (this.options.nav.arrows) {
            renderArrows(this.state.el);
        }
    }

    initState(): void {
        this.state.el = document.querySelector(this.selector);
        this.state.el.classList.add('s-swiper', this.options.theme);

        renderStage(this.state.el);
        this.state.inner = this.state.el.querySelector('.s-swiper__inner');
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
    }
};