// variables
const screens = document.querySelector('main').children;
const screensScrollPoints = Array.from(screens)
  .map(screen => screen.scrollHeight);
const headerLinks = document.querySelectorAll('.header__link');
let activeLink = 0;



// code
addActiveHeaderLink();
for (let i = 0; i < screensScrollPoints.length; i++)
  if (i !== 0)
    screensScrollPoints[i] += screensScrollPoints[i - 1] - 1;
  else
    screensScrollPoints[i] = 0;



// event listeneres
document.addEventListener('scroll', e => {
  if (intervalSearch(window.scrollY, screensScrollPoints) !== activeLink) {
    changeLink(intervalSearch(window.scrollY, screensScrollPoints));
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