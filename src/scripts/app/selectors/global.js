import store from 'store';
// global selector go here
export const isMobileViewport = () => {
	const browser = store.getState().browser;
	return browser.is.mobile || browser.is.tablet;
};
