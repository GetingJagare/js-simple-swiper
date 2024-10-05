export interface INavOptions {
    arrows?: boolean,
    dots?: boolean,
}

export interface ISwiperOptions {
    nav?: INavOptions,
    margin?: number,
    swiping?: boolean,
    maxSwipingVertAngle?: number,
    breakpoints?: {
        [key: number]: ISwiperOptions,
    },
}