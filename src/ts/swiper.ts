import { ISwiperOptions, ICommonObject } from "./interfaces/options";
import { IState } from "./interfaces/state";
import { linesAngle } from "./helpers/math";
import { Line } from "./interfaces/math";
import { renderStage } from "./views/stage";
import { renderArrows, renderDots } from "./views/nav";
import { mergeObjects, cloneObject } from "./helpers/object";
import '../scss/swiper.scss';

export default class Swiper {
    options: ISwiperOptions = {}
    defaultOptions: ISwiperOptions = {
        nav: {
            arrows: true,
            dots: true,
        },
        margin: 20,
        stagePadding: 30,
        items: 1,
        swiping: false,
        maxSwipingVertAngle: 45,
        theme: 'default',
        breakpoints: {
            768: {
                swiping: true,
            }
        }
    }
    userOptions: ISwiperOptions = {}
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
    swipingHandlers: ICommonObject = {}

    constructor(selector: string = '', options: ISwiperOptions = {}) {
        if (!selector) {
            return;
        }

        this.selector = selector;
        this.userOptions = options;

        this.initSwipingHandlers();
        this.init();
    }

    initSwipingHandlers() {
        this.swipingHandlers['mousedown'] = this.swipeStart.bind(this);
        this.swipingHandlers['touchstart'] = this.swipeStart.bind(this);

        this.swipingHandlers['mousemove'] = this.swipeDrag.bind(this);
        this.swipingHandlers['touchmove'] = this.swipeDrag.bind(this);

        this.swipingHandlers['mouseout'] = this.swipeEnd.bind(this);
        this.swipingHandlers['mouseup'] = this.swipeEnd.bind(this);
        this.swipingHandlers['touchend'] = this.swipeEnd.bind(this);
        this.swipingHandlers['touchcancel'] = this.swipeEnd.bind(this);
    }

    getBreakPointOptions(): ISwiperOptions | null {
        if (!this.options.breakpoints) {
            return null;
        }

        const breakpoints = Object.keys(this.options.breakpoints).map((br) => +br);
        breakpoints.sort();
        let options: ISwiperOptions | null = null;
        for (let i = breakpoints.length - 1; i >= 0; i--) {
            if (window.innerWidth >= breakpoints[i]) {
                continue;
            }

            if (!options) {
                options = {};
            }
            mergeObjects(this.options.breakpoints[breakpoints[i]], options);
        }

        return options;
    }

    applyOptions(): void {
        this.options = cloneObject(this.defaultOptions);
        mergeObjects(this.userOptions, this.options);

        const breakPointOptions = this.getBreakPointOptions();
        if (breakPointOptions) {
            mergeObjects(breakPointOptions, this.options);
        }
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
        const xAxis: Line = [
            {x: this.state.swiping.startX, y: e.clientY},
            {x: e.clientX, y: e.clientY},
        ];
        const hyp: Line = [
            {x: this.state.swiping.startX, y: this.state.swiping.startY},
            {x: e.clientX, y: e.clientY}
        ];

        return linesAngle(xAxis, hyp) > this.options.maxSwipingVertAngle;
    }

    isSwiping(): boolean {
        return this.state.swiping.startX !== null;
    }

    swipeStart(event: MouseEvent): void {
        const e = this.getEvent(event) as MouseEvent;
        if ((e.button !== undefined && e.button !== 0)) {
            return;
        }

        this.state.swiping.startX = e.clientX;
        this.state.swiping.startY = e.clientY;
    }

    swipeDrag(event: MouseEvent): void {
        if (!this.isSwiping()) {
            return;
        }

        const e = this.getEvent(event) as MouseEvent;
        if (this.isSwipingAngleBig(e)) {
            return;
        }

        event.preventDefault();

        const dx = e.clientX - this.state.swiping.startX;
        const translateX = this.calculateTranslate() - dx;
        this.state.stage.style.transform = `translateX(${translateX > 0 ? `-${translateX}` : -translateX}px)`;
    }

    swipeEnd (event: MouseEvent): void {
        if (!this.isSwiping()) {
            return;
        }

        const e = this.getEvent(event) as MouseEvent;

        if (this.isSwiping() && !this.isSwipingAngleBig(e)) {
            event.preventDefault();

            const dx = Math.sign(e.clientX - this.state.swiping.startX);
            const translateCondition = (this.state.currentItem < this.state.items.length - 1 && dx < 0) 
                || (this.state.currentItem > 0 && dx > 0);

            this.state.currentItem += translateCondition ? -dx : 0;
        }

        this.translateStage();
        this.resetSwipingState();
    }

    resetSwipingState() {
        this.state.swiping = {startX: null, startY: null};
    }

    detachSwipingEvents(): void {
        Object.keys(this.swipingHandlers).forEach((eventType: string) => {
            this.state.inner.removeEventListener(eventType, this.swipingHandlers[eventType]);
        });
    }

    attachSwipingEvents() {
        this.detachSwipingEvents();

        if (this.options.swiping) {
            Object.keys(this.swipingHandlers).forEach((eventType: string) => {
                this.state.inner.addEventListener(eventType, this.swipingHandlers[eventType]);
            });
        }
    }

    calculateTranslate(): number {
        return (this.state.itemWidth + this.options.margin) * this.state.currentItem;
    }

    translateStage(): void {
        this.state.stage.style.transform = `translateX(-${this.calculateTranslate()}px)`;

        if (this.options.nav.dots) {
            this.changeActiveDot();
        }

        if (this.options.nav.arrows) {
            this.checkArrowAccess();
        }
    }

    checkArrowAccess(): void {
        const prevArrow = this.state.el.querySelector('.s-swiper__arrow.prev');
        const nextArrow = this.state.el.querySelector('.s-swiper__arrow.next');
        prevArrow.classList[this.state.currentItem === 0 ? 'add' : 'remove']('disabled');
        nextArrow.classList[this.state.currentItem === this.state.items.length - 1 ? 'add' : 'remove']('disabled');
    }

    changeActiveDot(): void {
        const activeDot = this.state.el.querySelector('.s-swiper__dot.active');
        if (!activeDot) {
            return;
        }

        const dots = this.state.el.querySelectorAll('.s-swiper__dot');

        activeDot.classList.remove('active');
        dots[this.state.currentItem].classList.add('active');
    }

    setStyles(): void {
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

    resetStyles(): void {
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
        this.applyOptions();

        if (!this.state.initialized) {
            this.initState();
            this.initNavigation();

            this.attachEvents();
            this.state.initialized = true;
        } else {
            this.resetStyles();
        }

        this.setStyles();
        this.attachSwipingEvents();
    }
};