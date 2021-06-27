// variables
const screens = document.querySelector('main').children;
const screenScrollPoints = makeScreenScrollPoints(Array.from(screens));
const headerLinks = document.querySelectorAll('.header__link');
let activeLink = 0;



// code
addActiveHeaderLink();

console.log(screenScrollPoints);



// event listeneres
document.addEventListener('scroll', e => {
  console.log(window.scrollY);
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
function makeScreenScrollPoints(screens) {
  const screenScrollPoints = [0];
  const headerHeight = 90;
  for (let i = 0; i < screens.length - 1; i++) {
    screenScrollPoints[i + 1] = screenScrollPoints[i] + screens[i].scrollHeight - 1 - headerHeight;
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