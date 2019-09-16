const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

(function () {
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-mobile__list');
  const team = document.querySelector('.accordion');
  const teamItem = document.querySelectorAll('.accordion__item');
  const menu = document.querySelector('.accordion-menu');
  const menuItem = document.querySelectorAll('.accordion-menu__item');
  const reviewList = document.querySelector('.reviews__list');
  const popupReviews = document.querySelector('#popupReviews');
  const popupClose = document.querySelector('.popup__close');
  const form = document.querySelector('.delivery-form');
  const popupMessage = document.querySelector('#popupMessage');
  const popupMessageClose = document.querySelector('.popup__mes-close');
  const sliderControl = document.querySelector('.slider__control');
  const sliderContent = document.querySelector('.slider__content');
  let shiftSlide = 0;
  const placeMarks = [
    {
      latitude: 59.973495,
      longitude: 30.310718,
      hintContent: 'улица Чапыгина, 11'
    },
    {
      latitude: 59.945932,
      longitude: 30.380769,
      hintContent: 'Калужский переулок, 7'
    },
    {
      latitude: 59.887203,
      longitude: 30.313387,
      hintContent: 'Заставская улица, 46к2'
    },
    {
      latitude: 59.915270,
      longitude: 30.493510,
      hintContent: 'улица Подвойского, 33к2'
    }
  ];

  // Инициализация js
  let init = function () {
    _setUpListners();
    ymaps.ready(_mapInit);
  };

  // Прослушка событий
  let _setUpListners = function () {
    hamburger.addEventListener('click', function (e) {
      e.preventDefault();
      _toggleMenu();
    });

    navList.addEventListener('click', function (e) {
      if (e.target.className == 'nav-mobile__link') {
        _toggleMenu();
      }
    });

    team.addEventListener('click', function (e) {
      if (e.target.className == 'accordion__head') {
        e.preventDefault();
        _showTeam(e);
      }
    });

    menu.addEventListener('click', function (e) {
      e.preventDefault();
      if (e.target.classList.contains('accordion-menu__link')) {
        _showMenu(e);
      }
      if (e.target.classList.contains('accordion-menu__close')) {
        _closeBtn(e.target.parentElement);
      }
    });

    reviewList.addEventListener('click', function (e) {
      if (e.target.tagName == 'A') {
        e.preventDefault();
        let title = e.target.parentElement.firstElementChild;
        let text = title.nextElementSibling;
        _showPopupReview(title.innerHTML, text.innerHTML);
      }
    });

    popupClose.addEventListener('click', function (e) {
      e.preventDefault();
      _closeBtn(popupReviews);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let url = 'https://webdev-api.loftschool.com/sendmail';
      // let url = 'https://webdev-api.loftschool.com/sendmail/fail';
      let data = new FormData();

      data.append('name', e.target.elements.name.value);
      data.append('phone', e.target.elements.phone.value);
      data.append('comment', e.target.elements.comment.value);
      data.append('to', 'denis.toropin@yandex.ru');

      let xhr = new XMLHttpRequest();

      xhr.open('POST', url);
      xhr.responseType = 'json';
      xhr.send(data);
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          // console.error(xhr.status);
          _showPopupMessageSend('Что-то пошло не так...');
        } else {
          _showPopupMessageSend(xhr.response.message);
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
      }
      if (e.target.classList.contains('slider__arrow--right')) {
        _loop('left');
      }
    });
  };

  // Вспомогательные функции
  let _toggleMenu = function () {
    hamburger.classList.toggle('active');
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

  let _showPopupReview = function ($title, $text) {
    popupReviews.classList.add('active');
    let title = document.querySelector('.popup__title');
    title.innerHTML = $title;
    let text = document.querySelector('.popup__text');
    text.innerHTML = $text;
  }

  let _showPopupMessageSend = function (message) {
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

  let _mapInit = function () {
    let geoObject = [];
    let map = new ymaps.Map('map', {
      center: [59.923055, 30.385391],
      zoom: 11,
      controls: ['zoomControl'],
      behaviors: ['drag']
    });

    for (let i = 0; i < placeMarks.length; i++) {
      geoObject[i] = new ymaps.Placemark(
        [placeMarks[i].latitude, placeMarks[i].longitude],
        { hintContent: placeMarks[i].hintContent },
        {
          iconLayout: 'default#image',
          iconImageHref: 'images/sprite.svg#map-marker',
          iconImageSize: [46, 46],
          iconImageOffset: [-23, -46]
        }
      );
    }
    let clusters = new ymaps.Clusterer({ zoomMargin: 50 });
    map.geoObjects.add(clusters);
    clusters.add(geoObject);

    // Клик на placemark
    map.geoObjects.events.add('click', function (e) {
      var coords = e.get('target').geometry.getCoordinates();
      map.setCenter(coords, 17);
    });
  }

  return init();
})();
