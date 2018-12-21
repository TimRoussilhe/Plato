// all micro checking go there

// is a given value window?
// setInterval method is only available for window object
const iswindowObject = (value) => {
	return value != null && typeof value === 'object' && 'setInterval' in value;
};

let freeSelf = iswindowObject(typeof self == 'object' && self) && self;

// store navigator properties to use later
let navigator = freeSelf && freeSelf.navigator;
let appVersion = (navigator && navigator.appVersion || '').toLowerCase();
let userAgent = (navigator && navigator.userAgent || '').toLowerCase();
// let vendor = (navigator && navigator.vendor || '').toLowerCase();

// MOBILE
/* -------------------------------------------------------------------------- */

const isMobile = () => {
	return isIphone() || isIpod() || isAndroidPhone() || isBlackberry() || isWindowsPhone();
};

const isIphone = (range) => {
	// avoid false positive for Facebook in-app browser on ipad;
	// original iphone doesn't have the OS portion of the UA
	let match = isIpad() ? null : userAgent.match(/iphone(?:.+?os (\d+))?/);
	return match !== null && compareVersion(match[1] || 1, range);
};

const isIpod = (range) => {
	let match = userAgent.match(/ipod.+?os (\d+)/);
	return match !== null && compareVersion(match[1], range);
};

const isAndroidPhone = () => {
	return /android/.test(userAgent) && /mobile/.test(userAgent);
};

const isBlackberry = () => {
	return /blackberry/.test(userAgent) || /bb10/.test(userAgent);
};

const isWindowsPhone = () => {
	return isWindows() && /phone/.test(userAgent);
};

const isWindows = () => {
	return /win/.test(appVersion);
};

// TABLET
/* -------------------------------------------------------------------------- */

// is current device tablet?
export const isTablet = function() {
	return isIpad() || isAndroidTablet() || isWindowsTablet();
};

const isIpad = (range) => {
	let match = userAgent.match(/ipad.+?os (\d+)/);
	return match !== null && compareVersion(match[1], range);
};

const isAndroidTablet = () => {
	return /android/.test(userAgent) && !/mobile/.test(userAgent);
};

const isWindowsTablet = () => {
	return isWindows() && !isWindowsPhone() && /touch/.test(userAgent);
};

// is current device supports touch?
export const isTouchDevice = () => {
	return !!document && ('ontouchstart' in freeSelf ||
			('DocumentTouch' in freeSelf && document instanceof DocumentTouch));
};

// BROWSERS
/* -------------------------------------------------------------------------- */

export const isDesktop = () => {
	return !isMobile() && !isTablet();
};

const isIE = (range) => {
	let match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
	return match !== null && compareVersion(match[1], range);
};

const isChrome = (range) => {
	let match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
	return match !== null && is.not.opera() && compareVersion(match[1], range);
};

// is current browser edge?
const isEdge = (range) => {
	let match = userAgent.match(/edge\/(\d+)/);
	return match !== null && compareVersion(match[1], range);
};

const isFirefox = (range) => {
	let match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
	return match !== null && compareVersion(match[1], range);
};

const isSafari = (range) => {
	let match = userAgent.match(/version\/(\d+).+?safari/);
	return match !== null && compareVersion(match[1], range);
};

// helper function which compares a version to a range
function compareVersion(version, range) {
	let string = (range + '');
	let n = +(string.match(/\d+/) || NaN);
	let op = string.match(/^[<>]=?|/)[0];
	return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
}

// build a 'comparator' object for various comparison checks
const comparator = {
	'<': function(a, b) {
		return a < b;
	},
	'<=': function(a, b) {
		return a <= b;
	},
	'>': function(a, b) {
		return a > b;
	},
	'>=': function(a, b) {
		return a >= b;
	},
};

export const isString = (value) => {
	const type = typeof value;
	return type == 'string' || (type == 'object' && value != null && !Array.isArray(value) && getTag(value) == '[object String]');
};

export {
	isMobile,
};
