export function renderStage(
    parent: HTMLElement,
): void {
    const innerElement = document.createElement('div');
    innerElement.classList.add('s-swiper__inner');

    const stageElement = document.createElement('div');
    stageElement.classList.add('s-swiper__stage');
    innerElement.appendChild(stageElement);

    while (parent.children.length) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('s-swiper__item');
        itemElement.appendChild(parent.children[0]);
        stageElement.appendChild(itemElement);
    }

    parent.appendChild(innerElement);
}