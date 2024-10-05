export interface IState {
    currentItem: number,
    el: HTMLElement | null,
    style: CSSStyleDeclaration | null,
    stage: HTMLElement | null,
    items: HTMLCollection | Array<HTMLElement> | NodeList,
    slideWidth: number,
    initialized: boolean,
    theme: string,
    swiping: {
        startX: number | null,
        startY: number | null,
    },
}