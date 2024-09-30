let sliderExample = {
    el: null,
    elStyle: null,
    nav: null,
    dots: null,
    margin: 0,
    currentItem: 0,
    items: [],
    itemsCount: 0,
    slideWidth: 0,
    itemSelector: '',
    initialized: false,
    stage: null,
    swiping: false,
    maxSwipeAngle: 40,
    swipingState: {
        startX: null,
        startY: null,
    },

    initNav: function () {
        if (!this.nav) {
            return;
        }

        this.nav.addEventListener('click', (event) => {
            let navBtn = event.target.closest('.slider__nav-btn');

            if (navBtn.classList.contains('prev') && this.currentItem === 0) {
                return;
            }

            if (navBtn.classList.contains('next') && this.currentItem === this.itemsCount - 1) {
                return;
            }

            this.currentItem += (navBtn.classList.contains('prev') ? -1 : 1);
            this.translateStage();
        });
    },

    getEvent: function (e) {
        return e.changedTouches? e.changedTouches[0]: e;
    },

    isSwipingBigAngle: function (e) {
        const triangleVertex = [e.clientX, this.swipingState.startY];
        const hyp = Math.sqrt(Math.pow(e.clientX - this.swipingState.startX, 2) + Math.pow(e.clientY - this.swipingState.startY, 2));
        const cat = Math.sqrt(Math.pow(triangleVertex[0] - this.swipingState.startX, 2) + Math.pow(triangleVertex[1] - this.swipingState.startY, 2));

        const angle = Math.acos(cat / hyp) * 180 / Math.PI;

        return angle > this.maxSwipeAngle;
    },

    /**
     * @returns {null|boolean}
     */
    isSwiping: function () {
        return this.swipingState.startX || this.swipingState.startX === 0;
    },

    /**
     * @param event
     */
    swipeStart (event) {
        const e = this.getEvent(event);

        const target = e.target.closest(this.itemSelector);

        if (!target || (e.which && e.which !== 1)) {
            return;
        }

        event.preventDefault();

        this.swipingState.startX = e.clientX;
        this.swipingState.startY = e.clientY;
        this.stage.classList.add('slider__stage_smooth');
    },

    /**
     * @param event
     */
    swipeDrag (event) {
        const e = this.getEvent(event);
        const target = e.target.closest(this.itemSelector);

        if (!target || this.isSwipingBigAngle(e)) {
            return;
        }

        event.preventDefault();

        target.setAttribute('data-locked', true);

        const dx = e.clientX - this.swipingState.startX;
        let translateX = this.calculateTranslate() - dx;
        translateX = translateX > 0 ? '-' + translateX : -translateX;

        this.stage.style.transform = 'translateX(' + translateX + 'px)';
    },

    /**
     * @param event
     */
    swipeEnd (event) {
        const e = this.getEvent(event);
        const target = e.target.closest(this.itemSelector);

        if (!target || this.isSwipingBigAngle(e)) {
            return;
        }

        event.preventDefault();

        this.stage.classList.remove('slider__stage_smooth');

        const dx = Math.sign(e.clientX - this.swipingState.startX);

        const translateCondition = (this.currentItem < this.itemsCount - 1 && dx < 0) || (this.currentItem > 0 && dx > 0);

        this.currentItem += translateCondition ? -dx : 0;
        this.translateStage();

        this.swipingState = {startX: null, startY: null};

        setTimeout(function () {
            target.removeAttribute('data-locked');
        }, 500);

    },

    attachSwipingEvents() {
        const context = this;

        this.el.addEventListener('mousedown', function (e) { context.swipeStart(e); });
        this.el.addEventListener('touchstart', function (e) { context.swipeStart(e); });

        this.el.addEventListener('mousemove', function (e) { if (context.isSwiping()) { context.swipeDrag(e); } });
        this.el.addEventListener('touchmove', function (e) { if (context.isSwiping()) { context.swipeDrag(e); } });

        this.el.addEventListener('mouseout', function (e) { if (context.isSwiping()) { context.swipeEnd(e); } });
        this.el.addEventListener('mouseup', function (e) { if (context.isSwiping()) { context.swipeEnd(e); } });
        this.el.addEventListener('touchend', function (e) { if (context.isSwiping()) { context.swipeEnd(e); } });
        this.el.addEventListener('touchcancel', function (e) { if (context.isSwiping()) { context.swipeEnd(e); } });
    },

    switchSwiping() {
        if (window.matchMedia('(max-width: 767.98px)').matches) {
            this.attachSwipingEvents();
        }
    },

    initDots: function () {
        if (!this.dots) {
            return;
        }

        this.itemsCount = this.el.querySelectorAll(this.itemSelector).length;
        let thisObject = this;

        this.dots.addEventListener('click', function (event) {
            let dot = event.target.closest('.slider__dots-item');

            if (!dot) {
                return;
            }

            thisObject.currentItem = parseInt(dot.getAttribute('data-index'));
            thisObject.translateStage();
        });

    },

    calculateTranslate: function () {
        return (this.slideWidth + this.margin) * this.currentItem;
    },

    translateStage: function () {
        this.stage.style.transform = 'translateX(-' + this.calculateTranslate() + 'px)';
        this.changeActiveDot();
    },

    changeActiveDot: function () {
        let activeDot = this.dots.querySelector('.slider__dots-item.active');

        if (!activeDot) {
            return;
        }

        activeDot.classList.remove('active');
        let dots = this.dots.querySelectorAll('.slider__dots-item');
        dots[this.currentItem].classList.add('active');
    },

    setParameters: function () {
        this.stage = this.el.querySelector('.slider__stage');
        this.items = this.stage.querySelectorAll(this.itemSelector);
        this.itemsCount = this.items.length;
        this.slideWidth = parseFloat(this.elStyle.getPropertyValue('width'));

        this.el.style.width = this.slideWidth + "px";

        for (let i = 0; i < this.itemsCount; i++) {
            this.items[i].style = 'width:'+ this.slideWidth + 'px; margin-right: ' + this.margin + 'px;';
        }

        this.stage.style = 'width: ' + ((this.slideWidth + this.margin) * this.itemsCount) + 'px;' +
            'transform: translateX(-' + this.calculateTranslate() + 'px);';
    },

    resetInlineStyles: function () {
        this.el.removeAttribute('style');
        this.stage.removeAttribute('style');

        for (let i = 0; i < this.itemsCount; i++) {
            this.items[i].removeAttribute('style');
        }
    },

    init: function () {
        if (!this.initialized) {
            this.elStyle = getComputedStyle(this.el);
            this.initNav();
            this.initDots();

            this.initialized = true;
        } else {
            this.resetInlineStyles();
        }

        this.setParameters();

        if (this.swiping) {
            this.switchSwiping();
        }
    }
};

window.Slider = {
    sliders: [],

    create: function (slider, options) {
        if (!slider) {
            return;
        }

        let currentSlider = Object.assign({}, sliderExample);

        currentSlider.el = slider;

        for (let key in options) {
            currentSlider[key] = options[key];
        }

        this.sliders.push(currentSlider);
    },

    initSliders: function () {
        this.sliders.forEach((slider) => {
            slider.init();
        });
    },

    init() {
        this.initSliders();

        let thisObject = this;

        /******* debounce **********/
        let timeout = null;

        window.onresize = function () {
            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(function () {
                thisObject.initSliders();
            }, 300);
        }
    },
};