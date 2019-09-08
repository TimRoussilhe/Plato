const {
	saveRemoteData,
	updateRoutes
} = require('./saveData.js');
const chalk = require('chalk');
const log = console.log;
const print = chalk.grey;

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

exports.createPage = ({
	id,
	url,
	template,
	data
}, siteDir, dataMiddleware = null) => {
	return new Promise((resolve, reject) => {
		// create JSON File
		saveRemoteData(JSON.stringify(data), id + '.json', siteDir, dataMiddleware);

		const route = {
			id,
			url,
			template,
			json: id + '.json',
		};

		updateRoutes([route]).then(() => {
			log(print(` Created Page : ${id}`));
			resolve();
		});
	});
};
