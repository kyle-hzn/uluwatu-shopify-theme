import './styles/main.scss';
import Alpine from 'alpinejs';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

window.Alpine = Alpine;

// Définir les stores ici AVANT de démarrer Alpine
Alpine.store('cart', {
  cart: null,
  drawerOpen: false,
  loading: false,
});

Alpine.store('toast', {
  message: '',
  show: false,
  showToast(msg) {
    this.message = msg;
    this.show = true;
    setTimeout(() => this.show = false, 3000);
  },
});

Alpine.start(); // ✅ maintenant que les stores sont prêts

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

// === Galerie produit Swiper ===
const mainGallery = document.querySelector('.main-swiper');
const thumbGallery = document.querySelector('.thumb-swiper');

if (mainGallery && thumbGallery) {
  const thumbSwiper = new Swiper(thumbGallery, {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      768: {
        direction: 'vertical',
        slidesPerView: 5,
        spaceBetween: 12,
      },
    },
  });

  new Swiper(mainGallery, {
    spaceBetween: 10,
    loop: true,
    autoplay: {
      delay: 5000, // 3 secondes
      disableOnInteraction: false,
      pauseOnMouseEnter: true, // pause au hover
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: thumbSwiper,
    },
  });
}

// Carousel texte auto
document.addEventListener('alpine:init', () => {
  Alpine.store('cart', {
    cart: null,
    drawerOpen: false,
    loading: false,
  });

  Alpine.effect(() => {
    if (Alpine.store('cart').drawerOpen) {
      // Laisse le temps au DOM de se rendre
      setTimeout(() => {
        initTextSwiper();
      }, 100);
    }
  });
});

function initTextSwiper() {
  const carousels = document.querySelectorAll('.text-carousel:not(.swiper-initialized)');

  carousels.forEach((carousel) => {
    const slideCount = carousel.querySelectorAll('.swiper-slide').length;

    new Swiper(carousel, {
      loop: slideCount > 1,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initTextSwiper);