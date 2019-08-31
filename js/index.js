(function () {

  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav__list');
  const body = document.querySelector('body');

  let init = function () {
    _setUpListners();
  };

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
  };

  let _toggleMenu = function () {
    hamburger.classList.toggle('active');
    body.classList.toggle('noscroll');
  }


  return init();
})();
