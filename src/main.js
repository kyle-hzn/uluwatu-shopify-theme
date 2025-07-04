import './styles/main.scss';
import Alpine from 'alpinejs';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

window.Alpine = Alpine;
Alpine.start();

document.addEventListener('DOMContentLoaded', () => {
  // Marquee autoplay
  if (window.location.pathname === '/') {
    new Swiper('.marquee-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 4,
      loop: true,
      speed: 6000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      allowTouchMove: false,
    });
  }

  // Avis clients slider
  const reviewSlider = document.querySelector('.mySwiper');
  if (reviewSlider) {
    const swiper = new Swiper(reviewSlider, {
      slidesPerView: 1.2,
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 3000, // 3 secondes
        disableOnInteraction: false,
        pauseOnMouseEnter: true, // pause au hover
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        1024: {
          slidesPerView: 1.8,
        },
      },
      on: {
        slideChangeTransitionEnd: () => {
          updateSlideOpacity(swiper);
        },
      },
    });

    // Initial opacity update
    updateSlideOpacity(swiper);
  }

  // Helper pour opacité
  function updateSlideOpacity(swiperInstance) {
    swiperInstance.slides.forEach((slide) => {
      slide.classList.remove('opacity-30', 'transition-opacity', 'duration-500');
      if (!slide.classList.contains('swiper-slide-active')) {
        slide.classList.add('opacity-30', 'transition-opacity', 'duration-500');
      }
    });
  }
});