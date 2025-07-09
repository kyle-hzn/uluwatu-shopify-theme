import './styles/main.scss';
import Alpine from 'alpinejs';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

window.Alpine = Alpine;

document.addEventListener('alpine:init', () => {
  // === 🛒 STORE PANIER ===
  Alpine.store('cart', {
    cart: null,
    drawerOpen: false,
    loading: false,

    openDrawer() {
      this.drawerOpen = true;

      // ✅ Fermer le menu mobile s’il est ouvert
      if (Alpine.store('mobileMenu')?.open) {
        Alpine.store('mobileMenu').close();
      }
    },

    closeDrawer() {
      this.drawerOpen = false;
    },

    async reload() {
      const res = await fetch('/cart.js');
      const data = await res.json();
      data.items.forEach(item => item.quantity = Number(item.quantity));
      this.cart = data;
    },

    async updateQuantity(id, quantity) {
      this.loading = true;
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity: parseInt(quantity) })
      });
      await this.reload();
      this.loading = false;

      Alpine.store('toast')?.showToast("Quantité mise à jour.");
    },

    async removeItem(id) {
      this.loading = true;
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity: 0 })
      });
      await this.reload();
      this.loading = false;

      Alpine.store('toast')?.showToast("Produit retiré.");
    }
  });

  // === 📱 STORE MENU MOBILE ===
  Alpine.store('mobileMenu', {
    open: false,
    toggle(state) {
      this.open = state;
    },
    close() {
      this.open = false;
    }
  });

  // === 🔔 TOAST NOTIF
  Alpine.store('toast', {
    message: '',
    show: false,
    showToast(msg) {
      this.message = msg;
      this.show = true;
      setTimeout(() => this.show = false, 3000);
    }
  });

  // === 🔒 GESTION DU SCROLL BODY ===
  Alpine.effect(() => {
    const menuOpen = Alpine.store('mobileMenu').open;
    const drawerOpen = Alpine.store('cart').drawerOpen;

    if (menuOpen || drawerOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      // Attendre fin de transition (drawer/cart)
      setTimeout(() => {
        document.body.classList.remove('overflow-hidden');
      }, 300);
    }
  });

  // === 🎞️ AUTO-INIT SWIPER DANS DRAWER
  Alpine.effect(() => {
    if (Alpine.store('cart').drawerOpen) {
      setTimeout(() => {
        initTextSwiper();
      }, 100);
    }
  });
});

Alpine.start();


// === 🧩 SWIPERS INIT ON LOAD ===
document.addEventListener('DOMContentLoaded', () => {
  // Marquee
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

  // Avis
  const reviewSlider = document.querySelector('.mySwiper');
  if (reviewSlider) {
    const swiper = new Swiper(reviewSlider, {
      slidesPerView: 1.2,
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
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

    updateSlideOpacity(swiper);
  }

  // Galerie produit
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
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
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

  initTextSwiper();
});

function updateSlideOpacity(swiperInstance) {
  swiperInstance.slides.forEach((slide) => {
    slide.classList.remove('opacity-30', 'transition-opacity', 'duration-500');
    if (!slide.classList.contains('swiper-slide-active')) {
      slide.classList.add('opacity-30', 'transition-opacity', 'duration-500');
    }
  });
}

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