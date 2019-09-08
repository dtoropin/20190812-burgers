(function () {

  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav__list');
  const body = document.querySelector('body');
  const team = document.querySelector('.accordion');
  const teamItem = document.querySelectorAll('.accordion__item');
  const menuLink = document.querySelectorAll('.accordion-menu__link');
  const menuItem = document.querySelectorAll('.accordion-menu__item');
  const menuClose = document.querySelectorAll('.accordion-menu__close');
  const reviewList = document.querySelector('.reviews__list');
  const popupReviews = document.querySelector('#popupReviews');
  const popupClose = document.querySelector('.popup__close');
  const form = document.querySelector('.delivery-form');
  const popupMessage = document.querySelector('#popupMessage');
  const popupMessageClose = document.querySelector('.popup__mes-close');
  const sliderControl = document.querySelector('.slider__control');
  const sliderContent = document.querySelector('.slider__content');
  let shiftSlide = 0;

  let init = function () {
    _setUpListners();
  };

  // Прослушка событий
  let _setUpListners = function () {
    hamburger.addEventListener('click', function (e) {
      e.preventDefault();
      _toggleMenu();
    });

    navList.addEventListener('click', function (e) {
      if (e.target.className == 'nav__link' && window.innerWidth <= 992) {
        _toggleMenu();
      }
    });

    team.addEventListener('click', function (e) {
      if (e.target.className == 'accordion__head') {
        e.preventDefault();
        _showTeam(e);
      }
    });

    menuLink.forEach(function (elem) {
      elem.addEventListener('click', function (e) {
        e.preventDefault();
        _showMenu(e);
      });
    });

    menuClose.forEach(function (elem) {
      elem.addEventListener('click', function (e) {
        e.preventDefault();
        _closeBtn(e.target.parentElement);
      });
    });

    reviewList.addEventListener('click', function (e) {
      if (e.target.tagName == 'A') {
        e.preventDefault();
        let title = e.target.parentElement.firstElementChild;
        let text = title.nextElementSibling;
        _showReview(title.innerHTML, text.innerHTML);
      }
    });

    popupClose.addEventListener('click', function (e) {
      e.preventDefault();
      _closeBtn(popupReviews);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let url = 'https://webdev-api.loftschool.com/sendmail';
      let data = new FormData();

      data.append('name', e.target.elements.name.value);
      data.append('phone', e.target.elements.phone.value);
      data.append('comment', e.target.elements.comment.value);
      data.append('to', 'denis.toropin@yandex.ru');

      let xhr = new XMLHttpRequest();

      xhr.open('POST', url);
      xhr.responseType = 'json'; // ???
      xhr.send(data);
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          // console.error(xhr.status);
          _messageSend('Что-то пошло не так...');
        } else {
          _messageSend(xhr.response.message);
          // console.log(xhr);
        }
      });
      e.target.reset();
    });

    popupMessageClose.addEventListener('click', function (e) {
      e.preventDefault();
      _closeBtn(popupMessage);
    });

    sliderControl.addEventListener('click', function (e) {
      e.preventDefault();
      if (e.target.classList.contains('slider__arrow--left')) {
        _loop('right');
      } else if (e.target.classList.contains('slider__arrow--right')) {
        _loop('left');
      }
    });
  };

  // Вспомогательные функции
  let _toggleMenu = function () {
    hamburger.classList.toggle('active');
    body.classList.toggle('noscroll');
  }

  let _showTeam = function (e) {
    teamItem.forEach(function (elem) {
      if (elem !== e.target.parentElement)
        elem.classList.remove('active');
    });
    e.target.parentElement.classList.toggle('active');
  }

  let _showMenu = function (e) {
    menuItem.forEach(function (elem) {
      if (elem !== e.target.parentElement) {
        elem.classList.remove('active');
      }
    });
    e.target.parentElement.classList.toggle('active');
  }

  let _closeBtn = function (target) {
    target.classList.remove('active');
  }

  let _showReview = function ($title, $text) {
    popupReviews.classList.add('active');
    let title = document.querySelector('.popup__title');
    title.innerHTML = $title;
    let text = document.querySelector('.popup__text');
    text.innerHTML = $text;
  }

  let _messageSend = function (message) {
    popupMessage.classList.add('active');
    let popupMess = document.querySelector('.popup__mes-text');
    popupMess.innerHTML = message;
  }

  let _loop = function (direction) {
    let activeSlide = document.querySelector('.vision');
    if (direction === 'right' && activeSlide.previousElementSibling) {
      shiftSlide += 100;
      sliderContent.style.transform = `translateX(${shiftSlide}%)`;
      activeSlide.previousElementSibling.classList.add('vision');
      activeSlide.classList.remove('vision');
    }
    if (direction === 'left' && activeSlide.nextElementSibling) {
      shiftSlide -= 100;
      sliderContent.style.transform = `translateX(${shiftSlide}%)`;
      activeSlide.nextElementSibling.classList.add('vision');
      activeSlide.classList.remove('vision');
    }
  }

  return init();
})();
