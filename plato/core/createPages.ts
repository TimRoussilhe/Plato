import { saveRemoteData, updateRoutes } from './saveData.js';

// Things we need for a page
// id
// slug/url
// template
// json filename
// data to create the JSON

/**
 * Create a page.
 * This method let you create a page from the plato-node.js file
 * A page, is an item of the real_routes Object
 * A page is composed of the following element:
 *   - index ( used to match the route later etc...)
 * 	 - url ( the slug of the page )
 * 	 - template id ( template name to be match )
 * 	 - data *optional ( the path of remote data )
 *   - json ( the name of the json local date )
 * @param {Object} Page data - The info about the page
 * @param {string} siteDir - main directory output the page
 * @param {function} dataMiddleware - The blended color.
 * @return {Promise} createPage Promise
 */

export const createPages = (pagesProps, siteDir) => {
	return new Promise<string>(async (resolve, reject) => {
		// create JSON Files
		pagesProps.forEach(({ data, id }) => {
			saveRemoteData(JSON.stringify(data), id + '.json', siteDir + '/data/');
		});

		const routes = pagesProps.map(({ id, url, template }) => {
			return {
				id,
				url,
				template,
				json: id + '.json',
			};
		});

		try {
			const activeRoutes = await updateRoutes(routes);
			resolve(JSON.parse(activeRoutes));
		} catch (error) {
			reject(error);
		}

		reject('sad');
	});
};
