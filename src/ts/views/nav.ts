export function renderArrows(parent: HTMLElement): void {
    const arrowsElement = document.createElement('div');
    arrowsElement.classList.add('s-swiper__arrows');

    parent.appendChild(arrowsElement);

    const prevArrowElement = document.createElement('span');
    prevArrowElement.classList.add('s-swiper__arrow', 'prev', 'disabled');
    arrowsElement.appendChild(prevArrowElement);

    const nextArrowElement = document.createElement('span');
    nextArrowElement.classList.add('s-swiper__arrow', 'next');
    arrowsElement.appendChild(nextArrowElement);
}

export function renderDots(parent: HTMLElement, itemCount: number = 0): void {
    const dotsElement = document.createElement('div');
    dotsElement.classList.add('s-swiper__dots');

    parent.appendChild(dotsElement);

    for (let i = 0; i < itemCount; i++) {
        const dotElement = document.createElement('span');
        dotElement.classList.add('s-swiper__dot');

        if (i === 0) {
            dotElement.classList.add('active');
        }
        
        dotElement.setAttribute('data-index', `${i}`);
        dotsElement.appendChild(dotElement);
    }
}

