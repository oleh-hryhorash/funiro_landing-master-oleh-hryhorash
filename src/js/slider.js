import Swiper, { Navigation, Pagination, Parallax, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

//BildSlider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
	for (let index = 0; index < sliders.length; index++) {
		let slider = sliders[index];
		if (!slider.classList.contains('swiper-bild')) {
			let sliderItems = slider.children;
			if (sliderItems) {
				for (let index = 0; index < sliderItems.length; index++) {
					let el = sliderItems[index];
					el.classList.add('swiper-slide');
				}
			}
			let sliderContent = slider.innerHTML;
			let sliderWrapper = document.createElement('div');
			sliderWrapper.classList.add('swiper-wrapper');
			sliderWrapper.innerHTML = sliderContent;
			slider.innerHTML = '';
			slider.appendChild(sliderWrapper);
			slider.classList.add('swiper-bild');

			if (slider.classList.contains('_swiper_scroll')) {
				let sliderScroll = document.createElement('div');
				sliderScroll.classList.add('swiper-scrollbar');
				slider.appendChild(sliderScroll);
			}
		}
		if (slider.classList.contains('_gallery')) {
			//slider.data('lightGallery').destroy(true);
		}
	}
	// sliders_bild_callback();
}
// function sliders_bild_callback(params) { }

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
if (sliderScrollItems.length > 0) {
	for (let index = 0; index < sliderScrollItems.length; index++) {
		const sliderScrollItem = sliderScrollItems[index];
		const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
		const sliderScroll = new Swiper(sliderScrollItem, {
			observer: true,
			observeParents: true,
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			scrollbar: {
				el: sliderScrollBar,
				draggable: true,
				snapOnRelease: false
			},
			mousewheel: {
				releaseOnEdges: true,
			},
		});
		sliderScroll.scrollbar.updateSize();
	}
}


// function sliders_bild_callback(params) { }

if (document.querySelector('.slider-main__body')) {
    new Swiper('.slider-main__body', {
        modules: [Navigation, Pagination, Parallax, Autoplay],
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 32,
		watchOverflow: true,
		speed: 800,
		loop: true,
		loopAdditionalSlides: 5,
		preloadImages: false,
		parallax: true,
		// Dotts
		pagination: {
			el: '.controls-slider-main__dotts',
			clickable: true,
		},
		// Arrows
		navigation: {
			nextEl: '.slider-main .slider-arrow_next',
			prevEl: '.slider-main .slider-arrow_prev',
		},
		autoplay: {
			delay: 5000,
		}
	});
}

if (document.querySelector('.slider-inspiration__body')) {
    new Swiper('.slider-inspiration__body', {
        modules: [Navigation, Pagination, Parallax],
		observer: true,
		observeParents: true,
		slidesPerView: 'auto',
		spaceBetween: 24,
		watchOverflow: true,
		speed: 800,
		loop: true,
		loopAdditionalSlides: 5,
		preloadImages: false,
		parallax: true,
		// Dotts
		pagination: {
			el: '.slider-inspiration__dotts',
			clickable: true,
		},
		// Arrows
		navigation: {
			nextEl: '.slider-inspiration .slider-arrow_next',
			prevEl: '.slider-inspiration .slider-arrow_prev',
		}
	});
}

if (document.querySelector('.slider-tips__body')) {
    new Swiper('.slider-tips__body', {
        modules: [Navigation, Pagination, Parallax],
		observer: true,
		observeParents: true,
		breakpoints: {
			320: {
			  slidesPerView: 1,
			},
			480: {
				slidesPerView: 1.5,
			  },
			768: {
			  slidesPerView: 2,
			},
			992: {
			  slidesPerView: 3,
			}
		},
		spaceBetween: 32,
		watchOverflow: true,
		speed: 800,
		loop: true,
		centeredSlides: true,
		parallax: true,
		// Dotts
		pagination: {
			el: '.slider-tips__dotts',
			clickable: true,
		},
		// Arrows
		navigation: {
			nextEl: '.slider-tips .slider-arrow_next',
			prevEl: '.slider-tips .slider-arrow_prev',
		}
	});
}