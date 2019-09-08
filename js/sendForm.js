let myModule = (function () {

	let init = function () {
		console.log('It is myModule other!');
		_setUpListners();
	};

	let _setUpListners = function () {
		// прослушка событий
	};


	return {
		init: init
	}

})();

myModule.init();