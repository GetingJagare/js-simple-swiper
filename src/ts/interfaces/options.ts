export interface INavOptions {
    arrows?: boolean,
    dots?: boolean,
}

export interface ISwiperOptions {
    nav?: INavOptions,
    margin?: number,
    stagePadding?: number,
    items?: number,
    swiping?: boolean,
    maxSwipingVertAngle?: number,
    theme?: string,
    breakpoints?: {
        [key: number]: ISwiperOptions,
    },
}

export interface ICommonObject {
    [key: string]: any
}