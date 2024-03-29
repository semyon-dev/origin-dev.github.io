// variables
const backgroundImage = document.querySelector('.projects__background-image');

const projectsContent = document.querySelector('.projects__content');
const projectTemplate = document.querySelector('#projects__template').content;

const scrollToTopButton = document.querySelector('.scroll-to-top');

//code
let scrollToTopAnimation = new SmoothScroll('.scroll-to-top', {
	speed: 300,
  durationMax: 1000,
  easing: 'easeInOutCubic',
  topOnEmptyHash: true
});
fetch("./content/content.json")
  .then(response => response.json())
  .then(json => {
    // projects rendering
    const projects = json.projects;
    for (let i = 0; i < projects.length; i++) {
      const project = projectTemplate.cloneNode(true);
      const image = project.querySelector('.project-card__image');
      image.children[0].srcset = `./img/${projects[i].imageName}.webp`;
      image.children[1].srcset = `./img/${projects[i].imageName}.jpg`;
      image.children[2].alt = `${projects[i].title} logo`;
      project.querySelector('.project-card__title').textContent = projects[i].title;
      project.querySelector('.project-card__description').textContent = projects[i].description;
      project.querySelector('.project-card__button').href = `./projects.html#${i}`;
      projectsContent.append(project);
    }
    backgroundImage.style.height = `${1.5 * window.innerHeight}px`;
    backgroundScroll();
    setTimeout(() => {backgroundImage.style.transitionDuration = ''}, 500);
  });



//event listeners
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
    backgroundImageSizeChange();
  }
  setInterval(pollZoomFireEvent, 100);
})();

document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.remove('preload-transition');
});

document.addEventListener('scroll', e => {
  //background image parallax effect
  backgroundScroll(e);
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


//functions
function backgroundImageSizeChange() {
  const currentImageSize = Number.parseInt(backgroundImage.style.height);
  if (Number.isNaN(currentImageSize)) return;
  const difference = Math.abs(1.5 * window.innerHeight - currentImageSize);
  // console.log(difference);
  if (difference > 150)
    backgroundImage.style.height = `${1.5 * window.innerHeight}px`;
}

function backgroundScroll(event) {
  const heghtOfTheView        = window.innerHeight;
  const scrollablePartOfBody  = document.body.scrollHeight - heghtOfTheView;
  const percentOfScroll       = window.scrollY / scrollablePartOfBody;
  const scrollablePartOfImage = backgroundImage.scrollHeight - heghtOfTheView;

  backgroundImage.style.top = `-${scrollablePartOfImage * percentOfScroll}px`;
}