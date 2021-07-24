// variables
const header = document.querySelector('.header');
const headerLinks = header.querySelectorAll('.header__link');
const headerLogoLink = header.querySelector('.header__logo-link');
const headerHam = header.querySelector('.header__ham');
const screens = document.querySelector('main').children;

const heroButton = document.querySelector('.hero__button');

const whatWeDo = document.querySelector('.what-we-do');
const whatWeDoText = whatWeDo.querySelector('.what-we-do__text');
const whatWeDoImage = whatWeDo.querySelector('.what-we-do__image');

const projectsContent = document.querySelector('.projects__content');
const projectTemplate = document.querySelector('#projects__template').content;

const achievementsSlider = document.querySelector('.achievements__slider-inner');
const achievementTemplate = document.querySelector('#achievements__template').content;

const form = document.querySelector('.form');
const formName = form.querySelector('[name="name"]');
const formEmail = form.querySelector('[name="email"]');
const formTel = form.querySelector('[name="tel"]');
const formMessage = form.querySelector('[name="message"]');
const formItemAfters = form.querySelectorAll('.contacts__form-item-after');
const formSubmit = form.querySelector('.form__submit');
const formSubmitText = formSubmit.querySelector('.form__submit-text');
const formSubmitLogo = formSubmit.querySelector('.form__submit-logo');
const formSubmitSentText = formSubmit.querySelector('.form__submit-sent-text');
const formSubmitFailText = formSubmit.querySelector('.form__submit-fail-text');

const scrollToTopButton = document.querySelector('.scroll-to-top');

let screenScrollPoints;
let activeLink = 0;



// code
fetch("../content/content.json")
  .then(response => response.json())
  .then(json => {
    // projects rendering
    const projects = json.projects;
    for (let i = 0; i < 4; i++) {
      const project = projectTemplate.cloneNode(true);
      const image = project.querySelector('.project-card__image');
      image.children[0].srcset = `./img/${projects[i].imageName}.webp`;
      image.children[1].srcset = `./img/${projects[i].imageName}.jpg`;
      image.children[2].alt = `${projects[i].title} logo`;
      project.querySelector('.project-card__title').textContent = projects[i].title;
      project.querySelector('.project-card__description').textContent = projects[i].description;
      projectsContent.append(project);
    }

    // achievements rendering
    const achievements = json.achievements;
    for (let i = 0; i < achievements.length; i++) {
      const achievement = achievementTemplate.cloneNode(true);
      achievement.querySelector('.achievements__card-title').textContent = achievements[i].title;
      achievement.querySelector('.achievements__card-description').textContent = achievements[i].description;
      achievement.querySelector('.achievements__card-image').src = achievements[i].imageURL;
      achievement.querySelector('.achievements__card-image').alt = `${achievements[i].title} logo`;
      achievement.querySelector('.achievements__card-place').textContent = `${achievements[i].place} место`;
      achievementsSlider.append(achievement);
    }
    
    // slider launch
    new Glide('.glide', {
      type: 'carousel',
      focusAt: 'center',
      startAt: 1,
      perView: 3,
      perTouch: 2,
      touchRatio: 0.75,
      dragThreshold: 80,
      keyboard: false,
      gap: 16,
      peek: 8,
      animationTimingFunc: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
      animationDuration: 350,
      breakpoints: {
        1024: {
          focusAt: 0,
          perView: 2,
          perTouch: 1,
          touchRatio: 0.6,
          animationTimingFunc: 'cubic-bezier(0.34, 1.3, 0.64, 1)',
        },
        576: {
          focusAt: 'center',
          perView: 1,
          perTouch: 1,
          touchRatio: 0.5,
          animationTimingFunc: 'cubic-bezier(0.34, 1.25, 0.64, 1)',
        }
      }
    }).mount();
  });
addActiveHeaderLink();
breakpoints();
formSubmitLogo.style.animation = 'none';



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
    screenScrollPoints = makeScreenScrollPoints(Array.from(screens));
    breakpoints();
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
    scrollTo(e.target);
    let delay = 800;
    if (e.target.classList.contains('header__link_active'))
      delay = 0;
    for (let i = headerLinks.length - 1; i >= 0; i--) {
      setTimeout(() => headerLinks[i].parentElement.classList.remove('header__list-item-shown'), ((headerLinks.length - 1 - i) * 100 + delay));
    }
    setTimeout(() => header.classList.remove('header_opened-ham'), (headerLinks.length * 100 + delay));
  });
})

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

scrollToTopButton.addEventListener('click', e => scrollTo());
headerLogoLink.addEventListener('click', e => scrollTo());
heroButton.addEventListener('click', e => scrollTo(headerLinks[3]));

formName.addEventListener('input', e => {
  if (formName.value !== '') {
    formName.classList.add('contacts__form-item_css-validate');
  } else {
    formName.classList.remove('contacts__form-item_css-validate');
  }
})

formEmail.addEventListener('input', e => {
  if (formEmail.value !== '') {
    formTel.required = false;
    formEmail.classList.add('contacts__form-item_css-validate');
  } else {
    formTel.required = true;
    formEmail.classList.remove('contacts__form-item_css-validate');
  }
});

formTel.addEventListener('input', e => {
  if (formTel.value !== '') {
    formEmail.required = false;
    formTel.classList.add('contacts__form-item_css-validate');
  } else {
    formEmail.required = true;
    formTel.classList.remove('contacts__form-item_css-validate');
  }
});

formMessage.addEventListener('input', e => {
  if (formMessage.value !== '') 
    formMessage.classList.add('contacts__form-item_css-validate');
  else
    formMessage.classList.remove('contacts__form-item_css-validate');
});

formItemAfters.forEach(el => {
  el.addEventListener('click', e => {
    if (e.target.parentNode === form)
      e.target.previousSibling.previousSibling.focus()
    else
      e.target.parentNode.previousSibling.previousSibling.focus()
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();

  formSubmit.blur();
  formButtonWait();

  const _subject = formName.value ? 
  `Origin Dev: Пользователь ${formName.value} оставил сообщение!` : 
  'Origin Dev: Безымянный пользователь оставил сообщение!';
  
  fetch("https://formsubmit.co/ajax/ilya.iskra1337@gmail.com", {
    method: "POST",
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: formName.value || undefined,
      email: formEmail.value || undefined,
      tel: formTel.value || undefined,
      message: formMessage.value || undefined,
      _template: 'table',
      _subject
    })
  })
    .then(response => response.json())
    .then(data => {
      formButtonSent();
      // console.log(data);
    })
    .catch(error => {
      formButtonFail();
      // console.log(error);
    });

    formClear();
});



// functions
function fadeIn(element, duration = 1000, delay = 0) {
  element.classList.remove('form__submit_hidden');
  element.style.transition = `opacity ${duration/1000}s ${delay/1000}s`;
  element.style.opacity = '1';
  setTimeout(() => {
    element.style.transition = '';
  }, (duration + delay));
}

function fadeOut(element, duration = 1000, delay = 0) {
  element.style.transition = `opacity ${duration/1000}s ${delay/1000}s`;
  element.style.opacity = '0';
  setTimeout(() => {
    element.classList.add('form__submit_hidden');
    element.style.transition = '';
  }, (duration + delay));
}

function formButtonWait() {
  formSubmitLogo.style.animation = '';
  formSubmit.classList.add('form__submit_sending');
  fadeOut(formSubmitText, 500);
  setTimeout(() => fadeIn(formSubmitLogo, 500), 500);
}

function formButtonSent() {
  formSubmit.classList.remove('form__submit_sending');
  formSubmit.classList.add('form__submit_sent');
  fadeOut(formSubmitLogo, 250);
  setTimeout(() => {
    formSubmitLogo.style.animation = 'none';
    fadeIn(formSubmitSentText, 500)
  }, 500);

  setTimeout(() => {
    formSubmit.style.transitionDuration = '0.5s, 0.5s, 1s';
    formSubmit.classList.remove('form__submit_sent');
    setTimeout(() => formSubmit.style.transitionDuration = '', 1000);
    fadeOut(formSubmitSentText, 500);
    setTimeout(() => fadeIn(formSubmitText, 500), 500);
  }, 2500);
}

function formButtonFail() {
  formSubmit.classList.remove('form__submit_sending');
  formSubmit.classList.add('form__submit_fail');
  fadeOut(formSubmitLogo, 250);
  setTimeout(() => {
    formSubmitLogo.style.animation = 'none';
    fadeIn(formSubmitFailText, 500)
  }, 500);

  setTimeout(() => {
    formSubmit.style.transitionDuration = '0.5s, 0.5s, 1s';
    formSubmit.classList.remove('form__submit_fail');
    setTimeout(() => formSubmit.style.transitionDuration = '', 1000);
    fadeOut(formSubmitFailText, 500);
    setTimeout(() => fadeIn(formSubmitText, 500), 500);
  }, 2500);
}

function formClear() {
  formName.value = formEmail.value = formTel.value = formMessage.value = "";

  formName.classList.remove('contacts__form-item_css-validate');
  formEmail.classList.remove('contacts__form-item_css-validate');
  formTel.classList.remove('contacts__form-item_css-validate');
  formMessage.classList.remove('contacts__form-item_css-validate');

  formEmail.required = true;
  formTel.required = true;
}

function scrollTo(scrollLink = headerLinks[0]) {
  scrollLink.classList.add('header__link_pre-active');

  headerLinks.forEach(link => {
    if (link !== scrollLink && link !== headerLinks[activeLink])
      link.classList.add('header__link_not-active');
  });

  let checkIfScrollEnded = setInterval(() => {
    if ([...headerLinks].indexOf(scrollLink) === intervalSearch(window.scrollY, screenScrollPoints)) {
      headerLinks.forEach(link => link.classList.remove('header__link_not-active'));
      clearInterval(checkIfScrollEnded);
    }
  }, 100);
  
  setTimeout(() => {
    scrollLink.classList.remove('header__link_pre-active');
    headerLinks.forEach(link => link.classList.remove('header__link_not-active'));
    clearInterval(checkIfScrollEnded);
  }, 1000);
}

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

function whatWeDoImageMove(where) {
  const isImageInText = [...whatWeDoText.children].includes(whatWeDoImage);
  if (where === 'block' && isImageInText) {
    whatWeDoImage.remove();
    whatWeDo.append(whatWeDoImage);
  } else if (where === 'text' && !isImageInText) {
    whatWeDoImage.remove();
    whatWeDoText.append(whatWeDoImage);
  }
}

function breakpoints() {
  const widthNow = window.innerWidth;
  const heightNow = window.innerHeight;
  if (widthNow <= 576) {
    whatWeDoImageMove('text');
  } else if (widthNow <= 768) {
    // console.log('nothing');
  } else {
    whatWeDoImageMove('block');
  }
}