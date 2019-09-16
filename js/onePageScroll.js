//! onePageScroll
(function () {
	const pages = document.querySelectorAll('.section');
	const content = document.querySelector('.main-content');
	const points = document.querySelectorAll('.navpage__item');
	const dataScrollTo = document.querySelectorAll('[data-scroll-to]');
	const hamburger = document.querySelector('.hamburger');
	const popups = document.querySelectorAll('.popup');
	let inScroll = false;

	const init = function () {
		_setUpListners();
	};

	const _setUpListners = function () {
		document.addEventListener('wheel', _wheel);
		document.addEventListener('keydown', _keyPush);
		dataScrollTo.forEach(function (elem) {
			elem.addEventListener('click', _scrollTo);
		});
	};

	let _wheel = function (e) {
		if (_overlayActive()) return false;
		let direct = e.deltaY > 0 ? 'up' : 'down';
		_scrollToPage(direct);
	}

	let _keyPush = function (e) {
		switch (e.keyCode) {
			case 40:
				_scrollToPage('up');
				break;
			case 38:
				_scrollToPage('down');
				break;
			default:
				break;
		}
	}

	let _overlayActive = function () {
		let isActive = false;
		if (hamburger.classList.contains('active')) isActive = true;
		popups.forEach(function (el) {
			if (el.classList.contains('active')) isActive = true;
		});
		return isActive;
	}

	let _scrollTo = function (e) {
		e.preventDefault();
		_moveTo(e.target.dataset.scrollTo);
	}

	let _scrollToPage = function (direction) {
		let page = _activePage();

		if (direction === 'up' && page.next) {
			let numPage = page.index + 1;
			_moveTo(numPage);
		}
		if (direction === 'down' && page.prev) {
			let numPage = page.index - 1;
			_moveTo(numPage);
		}
	}

	let _activePage = function () {
		for (let i = 0; i < pages.length; i++) {
			if (pages[i].classList.contains('is-active')) {
				return {
					index: i,
					active: pages[i],
					next: pages[i].nextElementSibling,
					prev: pages[i].previousElementSibling
				}
			}
		}
	}

	let _addClass = function (arr, idx) {
		arr[idx].classList.add('is-active');
		for (const item of arr) {
			if (item != arr[idx])
				item.classList.remove('is-active');
		}
	}

	let _moveTo = function (idx) {
		let position = `${idx * (-100)}%`;

		if (inScroll) return;
		inScroll = true;
		_addClass(pages, idx);

		content.style.transform = `translateY(${position})`;
		_addClass(points, idx);

		setTimeout(() => {
			inScroll = false;
		}, 700);
	}


	return init();
})();