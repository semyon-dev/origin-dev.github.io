// variables
const screens = document.querySelector('main').children;
const headerLinks = document.querySelectorAll('.header__link');
const scrollToTopButton = document.querySelector('.scroll-to-top');
const projectsContent = document.querySelector('.projects__content');
const projectTemplate = projectsContent.querySelector('template').content;
let screenScrollPoints;
let activeLink = 0;



// code
fetch("../content/content.json")
  .then(response => response.json())
  .then(json => {
    const projects = json.projects;
    for (let i = 0; i < 4; i++) {
      const project = projectTemplate.cloneNode(true);
      project.querySelector('.project-card__image').src = projects[i].imageURL;
      project.querySelector('.project-card__image').alt = projects[i].imageAlt;
      project.querySelector('.project-card__title').textContent = projects[i].title;
      project.querySelector('.project-card__description').textContent = projects[i].description;
      projectsContent.append(project);
    }
  });
addActiveHeaderLink();



// event listeners
(function(){ //zoom listener
  var lastWidth = 0;
  var lastHeight = 0;
  function pollZoomFireEvent() {
    var widthNow = window.innerWidth;
    var heightNow = window.innerHeight;

    if (lastWidth == widthNow && lastHeight == heightNow) return;
    lastWidth = widthNow;
    lastHeight = heightNow;
    // Length changed, user must have zoomed, invoke listeners.
    screenScrollPoints = makeScreenScrollPoints(Array.from(screens));
  }
  setInterval(pollZoomFireEvent, 100);
})();

document.addEventListener('scroll', e => {
  //header links underline
  screenScrollPoints = makeScreenScrollPoints(Array.from(screens));
  const currentActive = intervalSearch(window.scrollY, screenScrollPoints);
  if (currentActive !== activeLink) {
    changeLink(currentActive);
  }

  //scroll-to-top button
  if (window.scrollY >= screens[0].scrollHeight - 91) {
    scrollToTopButton.classList.add('scroll-to-top_active');
    scrollToTopButton.tabIndex = 0;
  }
  else {
    scrollToTopButton.classList.remove('scroll-to-top_active');
    scrollToTopButton.tabIndex = -1;
  }
})

headerLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.target.classList.add('header__link_pre-active');

    headerLinks.forEach(link => {
      if (link !== e.target && link !== headerLinks[activeLink])
        link.classList.add('header__link_not-active');
    });

    let checkIfScrollEnded = setInterval(() => {
      console.log("I'm running!");
      if ([...headerLinks].indexOf(e.target) === intervalSearch(window.scrollY, screenScrollPoints)) {
        headerLinks.forEach(link => link.classList.remove('header__link_not-active'));
        clearInterval(checkIfScrollEnded);
      }
    }, 100);
    
    setTimeout(() => {
      e.target.classList.remove('header__link_pre-active');
      headerLinks.forEach(link => link.classList.remove('header__link_not-active'));
      clearInterval(checkIfScrollEnded);
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
  const screenScrollPoints = [(-1 * headerHeight - 60)];

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

