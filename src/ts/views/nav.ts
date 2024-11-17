export function renderArrows(): HTMLElement {
    const arrowsElement = document.createElement('div');
    arrowsElement.classList.add('s-swiper__arrows');

    const prevArrowElement = document.createElement('span');
    prevArrowElement.classList.add('s-swiper__arrow', 'prev', 'disabled');
    arrowsElement.appendChild(prevArrowElement);

    const nextArrowElement = document.createElement('span');
    nextArrowElement.classList.add('s-swiper__arrow', 'next');
    arrowsElement.appendChild(nextArrowElement);

    return arrowsElement;
}

export function renderDots(itemCount: number = 0): HTMLElement {
    const dotsElement = document.createElement('div');
    dotsElement.classList.add('s-swiper__dots');

    for (let i = 0; i < itemCount; i++) {
        const dotElement = document.createElement('span');
        dotElement.classList.add('s-swiper__dot');

        if (i === 0) {
            dotElement.classList.add('active');
        }
        
        dotElement.setAttribute('data-index', `${i}`);
        dotsElement.appendChild(dotElement);
    }

    return dotsElement;
}

