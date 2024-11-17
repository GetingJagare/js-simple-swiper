export interface IState {
    currentItem: number,
    el: HTMLElement | null,
    stage: HTMLElement | null,
    dots: HTMLElement | null,
    arrows: HTMLElement | null,
    inner: HTMLElement | null,
    items: HTMLCollection | Array<HTMLElement> | NodeList,
    swiperWidth: number,
    itemWidth: number,
    initialized: boolean,
    swiping: {
        startX: number | null,
        startY: number | null,
    },
}