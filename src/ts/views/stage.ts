export function renderStage(itemList: HTMLCollection | NodeList | Array<HTMLElement>): string {
    let items = ``;

    for (let i = 0; i < itemList.length; i++) {
        items = `${items}<div class="s-swiper__item">${(itemList[i] as HTMLElement).outerHTML}</div>`
    }

    return `<div class="s-swiper__stage">${items}</div>`;
}