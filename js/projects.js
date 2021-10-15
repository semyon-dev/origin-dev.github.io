// variables
const scrollToTopButton = document.querySelector('.scroll-to-top');


//code
let scrollToTopAnimation = new SmoothScroll('.scroll-to-top', {
	speed: 300,
  durationMax: 1000,
  easing: 'easeInOutCubic',
  topOnEmptyHash: true
});


// event listeners
document.addEventListener('scroll', e => {
  //scroll-to-top button
  if (window.scrollY >= window.innerHeight) {
    scrollToTopButton.classList.add('scroll-to-top_active');
    scrollToTopButton.tabIndex = 0;
  }
  else {
    scrollToTopButton.classList.remove('scroll-to-top_active');
    scrollToTopButton.tabIndex = -1;
  }
});