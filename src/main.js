import './styles/main.scss';
import Alpine from 'alpinejs';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

window.Alpine = Alpine;
Alpine.start();

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/') {

    new Swiper('.marquee-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 4,
      loop: true,
      speed: 6000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false
      },
      allowTouchMove: false
    });
  }
});