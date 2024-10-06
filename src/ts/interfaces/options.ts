export interface INavOptions {
    arrows?: boolean,
    dots?: boolean,
}

export interface ISwiperOptions {
    nav?: INavOptions,
    margin?: number,
    stagePadding?: number,
    swiping?: boolean,
    maxSwipingVertAngle?: number,
    theme?: string,
    breakpoints?: {
        [key: number]: ISwiperOptions,
    },
}