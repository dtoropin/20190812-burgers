//! video
const videoModule = (function () {
	const video = document.getElementById('video');
	const playBtn = document.querySelectorAll('.play');
	const videoPlayBtn = document.querySelector('.video__play');
	const durationControl = document.getElementById('videoDuration');
	const soundControl = document.getElementById('videoVolume');
	const switchSound = document.getElementById('soundOnOff');
	let intervalId;

	const init = function () {
		_setUpListners();
		durationControl.min = 0;
		durationControl.value = 0;
		soundControl.min = 0;
		soundControl.max = 10;
		soundControl.value = soundControl.max;
	};

	const _setUpListners = function () {
		video.addEventListener('click', _play);
		playBtn.forEach(function (elem) {
			elem.addEventListener('click', _play);
		});
		switchSound.addEventListener('click', _soundOff);
		soundControl.addEventListener('click', _changeSoundVolume);
		soundControl.addEventListener('mousedown', _changeSoundVolume);
		durationControl.addEventListener('mousedown', _stopInterval);
		durationControl.addEventListener('click', _setVideoDuration);
	};

	let _play = function () {
		videoPlayBtn.classList.toggle('active');
		durationControl.max = video.duration;
		if (video.paused) {
			video.play();
			intervalId = setInterval(_updateDuration, 15);
		} else {
			video.pause();
			clearInterval(intervalId);
		}
	}

	let _updateDuration = function () {
		durationControl.value = video.currentTime;
	}

	let _soundOff = function () {
		if (video.volume === 0) {
			video.volume = soundLevel;
			soundControl.value = soundLevel * 10;
		} else {
			soundLevel = video.volume;
			video.volume = 0;
			soundControl.value = 0;
		}
	}

	let _changeSoundVolume = function () {
		video.volume = soundControl.value / 10;
	}

	let _stopInterval = function () {
		video.pause();
		clearInterval(intervalId);
	}

	let _setVideoDuration = function () {
		if (video.paused) {
			video.play();
		} else {
			video.pause();
		}

		video.currentTime = durationControl.value;
		intervalId = setInterval(_updateDuration, 15);
	}


	return {
		init: init
	}
})();

document.addEventListener('DOMContentLoaded', videoModule.init());