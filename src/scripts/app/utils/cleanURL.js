const expr = /\/+$/;

const removeTrailingSlash = str => {
	return String(str).replace(expr, '');
};
const removeTrailingIndexHTML = str => {
	return str.split('index.html')[0];
};

export const cleanURL = (url, options = {}) => {
	// check if ending by index.html

	// check if trailling slash
	// const testUrl = removeTrailingSlash(url);
	const testNoIndex = removeTrailingIndexHTML(url);

	if (testNoIndex !== url) {
		window.history.replaceState(null, null, testNoIndex);
	}
};
