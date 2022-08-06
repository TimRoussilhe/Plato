export const rad = x => {
	return (x * Math.PI) / 180;
};

export const metersToMiles = meters => {
	return meters * 0.00062137;
};

export const fitAsset = config_ => {
	const wi = config_.width;
	const hi = config_.height;
	const ri = wi / hi;
	const ws = config_.containerWidth;
	const hs = config_.containerHeight;
	const rs = ws / hs;
	const newDimensions = {};

	if (ri > rs) {
		newDimensions.ratio = hs / hi;
		newDimensions.w = Math.ceil((wi * hs) / hi, (newDimensions.h = hs));
	} else {
		newDimensions.ratio = ws / wi;
		newDimensions.w = ws;
		newDimensions.h = Math.ceil((hi * ws) / wi);
	}

	newDimensions.top = (hs - newDimensions.h) / 2;
	newDimensions.left = (ws - newDimensions.w) / 2;

	return newDimensions;
};

export const fitAssetContains = config_ => {
	const wi = config_.width;
	const hi = config_.height;
	const ri = wi / hi;
	const ws = config_.containerWidth;
	const hs = config_.containerHeight;
	const rs = ws / hs;
	const newDimensions = {};

	// item is wider than container
	if (ri > rs) {
		newDimensions.ratio = hs / hi;
		newDimensions.w = ws;
		newDimensions.h = Math.ceil(ws / ri);
	}
	// item is taller than container
	else {
		newDimensions.ratio = ws / wi;
		newDimensions.w = Math.ceil(hs * ri);
		newDimensions.h = hs;
	}
	return newDimensions;
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// https://www.joshwcomeau.com/snippets/javascript/debounce/
export const debounce = (callback, wait) => {
	let timeoutId = null;
	return (...args) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback.apply(null, args);
		}, wait);
	};
};

export const throttle = (callback, wait, immediate = false) => {
	let timeout = null;
	let initialCall = true;

	return function() {
		const callNow = immediate && initialCall;
		const next = () => {
			callback.apply(this, arguments);
			timeout = null;
		};

		if (callNow) {
			initialCall = false;
			next();
		}

		if (!timeout) {
			timeout = setTimeout(next, wait);
		}
	};
};

export const getRandomIntInclusive = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
