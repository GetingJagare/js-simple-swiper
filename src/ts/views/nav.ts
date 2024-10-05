import { INavOptions } from "../interfaces/options";

function renderButtons(): string {
    return `<div class="s-swiper__buttons">` +
		`<button type="button" class="s-swiper__nav-btn prev disabled">&lt;</button>` +
		`<button type="button" class="s-swiper__nav-btn next">&gt;</button>` +
		`</div>`
}

export function renderNavigation(itemCount: number = 0, navOptions: INavOptions): string {
    return `<div class="s-swiper__nav>${renderButtons()}</div>`;
}

