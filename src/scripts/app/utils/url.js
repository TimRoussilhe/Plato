/**
 * URL utils.
 *
 * - Collect and structure information from URLs
 *
 */

/**
 * Get location href.
 */
export const getHref = () => window.location.href;

/**
 * Get location origin.
 */
export const getOrigin = () => window.location.origin;

/**
 * Get port based on URL or location.
 */
export const getPort = (url = window.location.href) => parse(url).port;

/**
 * Get path from URL.
 */
export const getPath = (url = window.location.href) => parse(url).path;

/**
 * Get query object from URL.
 */
// export const getQuery = (url: string): IGenericObject => parse(url).query;

/**
 * Get hash from URL.
 */
// export const getHash = (url: string): string => parse(url).hash;

/**
 * Parse URL for path, query and hash and more.
 */
export const parse = url => {
	// Port
	let port;
	const matches = url.match(/:\d+/);

	if (matches === null) {
		if (/^http/.test(url)) {
			port = 80;
		}

		if (/^https/.test(url)) {
			port = 443;
		}
	} else {
		const portString = matches[0].substring(1);

		port = parseInt(portString, 10);
	}

	// Path
	let path = url.replace(getOrigin(), '');
	let hash;
	let query = {};

	// Hash
	const hashIndex = path.indexOf('#');

	if (hashIndex >= 0) {
		hash = path.slice(hashIndex + 1);
		path = path.slice(0, hashIndex);
	}

	// Query
	const queryIndex = path.indexOf('?');

	if (queryIndex >= 0) {
		query = parseQuery(path.slice(queryIndex + 1));
		path = path.slice(0, queryIndex);
	}

	return {
		hash,
		path,
		port,
		query,
	};
};

/**
 * Parse a query string to object.
 */
export const parseQuery = str =>
	str.split('&').reduce((acc, el) => {
		const [key, value] = el.split('=');

		acc[key] = value;

		return acc;
	}, {});

/**
 * Clean URL, remove "hash" and/or "trailing slash".
 */
export const clean = (url = window.location.href) => url.replace(/(\/#.*|\/|#.*)$/, '');
