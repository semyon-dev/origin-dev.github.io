// variables
const screens = document.querySelector('main').children;
let screenScrollPoints = makeScreenScrollPoints(Array.from(screens));
const headerLinks = document.querySelectorAll('.header__link');
let activeLink = 0;



// code
addActiveHeaderLink();



// event listeners
(function(){ //zoom listener
  var lastWidth = 0;
  function pollZoomFireEvent() {
    var widthNow = window.innerWidth;
    if (lastWidth == widthNow) return;
    lastWidth = widthNow;
    // Length changed, user must have zoomed, invoke listeners.
    screenScrollPoints = makeScreenScrollPoints(Array.from(screens));
  }
  setInterval(pollZoomFireEvent, 100);
})();

document.addEventListener('scroll', e => {
  if (intervalSearch(window.scrollY, screenScrollPoints) !== activeLink) {
    changeLink(intervalSearch(window.scrollY, screenScrollPoints));
  }
})

headerLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.target.classList.add('header__link_pre-active');
    setTimeout(() => {
      e.target.classList.remove('header__link_pre-active');
    }, 1000);
  });
})



// functions
function getAbsoluteHeight(el) {
  let styles = window.getComputedStyle(el);
  let margin = parseFloat(styles['marginTop']) +
               parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}

function makeScreenScrollPoints(screens) {
  const headerHeight = 90;
  const screenScrollPoints = [(-1 * headerHeight - 1)];

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
  headerLinks[activeLink].classList.remove('header__link_pre-active')
  headerLinks[activeLink].classList.add('header__link_active');
}

function changeLink(number) {
  activeLink = number;
  clearActiveHeaderLinks();
  addActiveHeaderLink();
}

