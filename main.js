window.addEventListener('DOMContentLoaded', function () {
	const sl = document.getElementById('slider');

	let navigation = sl.nextElementSibling;
    let computedStyle = getComputedStyle(sl);

    Slider.create(sl, {
            nav: navigation ? navigation.querySelector('.slider__nav') : null,
            dots: navigation ? navigation.querySelector('.slider__dots') : null,
            margin: parseFloat(computedStyle.getPropertyValue('--margin')),
            itemSelector: '.slider__item',
        });

    Slider.init();
});