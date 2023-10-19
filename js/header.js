// variables
const root = document.getElementById('root');

const header = document.querySelector('.header');
const headerLinks = header.querySelectorAll('.header__link');
const headerLogoLink = header.querySelector('.header__logo-link');
const headerHam = header.querySelector('.header__ham');
const screens = root?.children;

let screenScrollPoints;
let activeLink = root ? 0 : undefined;



// code
addActiveHeaderLink();
let scroll = new SmoothScroll();
const scrollOptions = {
	speed: 300,
  durationMax: 1000,
  easing: 'easeInOutCubic'
};



// event listeners
(function(){ //zoom listener
  let lastWidth = 0;
  let lastHeight = 0;
  function pollZoomFireEvent() {
    let widthNow = window.innerWidth;
    let heightNow = window.innerHeight;

    if (lastWidth == widthNow && lastHeight == heightNow) return;
    lastWidth = widthNow;
    lastHeight = heightNow;
    // Length changed, user must have zoomed, invoke listeners.
    if (root)
      screenScrollPoints = makeScreenScrollPoints(Array.from(screens));
  }
  setInterval(pollZoomFireEvent, 100);
})();

if (root) {
  document.addEventListener('scroll', e => {
    screenScrollPoints = makeScreenScrollPoints(Array.from(screens));
    const currentActive = intervalSearch(window.scrollY, screenScrollPoints);
    if (currentActive !== activeLink) {
      // console.log(`Current link has been changed from ${activeLink} to ${currentActive}`);
      changeLink(currentActive);
    }
  });
}

headerLinks.forEach(link => {
  link.addEventListener('click', e => {
    if (Array.from(headerLinks).indexOf(e.target) === activeLink) {
      const currentWindowScrollY = window.scrollY;
      const screenScrollPoint = screenScrollPoints[activeLink] + 20;
      const safeZone = 50;
      // console.log(`${screenScrollPoint - safeZone} <= ${currentWindowScrollY} <= ${screenScrollPoint + safeZone}`)
      if (screenScrollPoint - safeZone <= currentWindowScrollY && currentWindowScrollY <= screenScrollPoint + safeZone) {
        e.preventDefault();
        return;
      }
    }

    myScrollTo(e.target);
    let delay = 800;
    if (e.target.classList.contains('header__link_active'))
      delay = 0;
    for (let i = headerLinks.length - 1; i >= 0; i--) {
      setTimeout(() => headerLinks[i].parentElement.classList.remove('header__list-item-shown'), ((headerLinks.length - 1 - i) * 100 + delay));
    }
    setTimeout(() => header.classList.remove('header_opened-ham'), (headerLinks.length * 100 + delay));
  });
});

headerHam.addEventListener('click', e => {
  if (header.classList.contains('header_opened-ham')) {
    for (let i = headerLinks.length - 1; i >= 0; i--) {
      setTimeout(() => headerLinks[i].parentElement.classList.remove('header__list-item-shown'), ((headerLinks.length - 1 - i) * 100));
    }
    setTimeout(() => header.classList.remove('header_opened-ham'), (headerLinks.length * 100));
  } else {
    header.classList.add('header_opened-ham');
    for (let i = 0; i < headerLinks.length; i++) {
      setTimeout(() => headerLinks[i].parentElement.classList.add('header__list-item-shown'), (i * 100 + 150));
    }
  }
});

headerLogoLink.addEventListener('click', e => myScrollTo());




// functions
function myScrollTo(scrollLink = headerLinks[0]) {
  scrollLink.classList.add('header__link_pre-active');

  headerLinks.forEach(link => {
    if (link !== scrollLink && link !== headerLinks[activeLink])
      link.classList.add('header__link_not-active');
  });

  let query = "#" + scrollLink.href.split("#")[1];
  scroll.animateScroll(document.querySelector(query), null, scrollOptions);

  let checkIfScrollEnded = setInterval(() => {
    // console.log(`${[...headerLinks].indexOf(scrollLink)} ${intervalSearch(window.scrollY, screenScrollPoints)}`)
    if ([...headerLinks].indexOf(scrollLink) === intervalSearch(window.scrollY, screenScrollPoints)) {
      setTimeout(() => {
        headerLinks.forEach(link => link.classList.remove('header__link_not-active'));
        clearInterval(checkIfScrollEnded);
      }, 500);
    }
  }, 100);

  setTimeout(() => {
    scrollLink.classList.remove('header__link_pre-active');
    headerLinks.forEach(link => link.classList.remove('header__link_not-active'));
    clearInterval(checkIfScrollEnded);
  }, 1500);
}

function getAbsoluteHeight(el) {
  let styles = window.getComputedStyle(el);
  let margin = parseFloat(styles['marginTop']) +
               parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}

function makeScreenScrollPoints(screens) {
  const headerHeight = 90;
  const screenScrollPoints = [(-1 * headerHeight - 80)];

  for (let i = 0; i < screens.length - 1; i++) {
    if (screens[i].id === "")
      screenScrollPoints[screenScrollPoints.length - 1] += getAbsoluteHeight(screens[i]);
    else
      screenScrollPoints[screenScrollPoints.length] = screenScrollPoints[screenScrollPoints.length - 1] + getAbsoluteHeight(screens[i]) - 1;
  }

  return screenScrollPoints;
}

function intervalSearch(num, intervals) {
  for (let i = 0; i < intervals.length - 1; i++) {
    if (num >= intervals[i] && num < intervals[i + 1])
      return i;
  }

  return intervals.length - 1;
}

function clearActiveHeaderLinks() {
  for (const headerLink of headerLinks)
    headerLink.classList.remove('header__link_active');
}

function addActiveHeaderLink() {
  headerLinks[activeLink]?.classList.add('header__link_active');
}

function changeLink(number) {
  activeLink = number;
  setTimeout(() => {
    clearActiveHeaderLinks();
    addActiveHeaderLink();
  }, 150);
}