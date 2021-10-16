// variables
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
fetch("../content/content.json")
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
  });



// event listeners
document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.remove('preload-transition');
});

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