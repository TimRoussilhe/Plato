const Promise = require('bluebird');
const fetch = require('node-fetch');
fetch.Promise = Promise;
const {createPage} = require('./plato/core/createPage');

exports.createPages = (siteDir) => {

	return new Promise((resolve, reject) => {

		fetch('https://d1ijeakjvj2nvu.cloudfront.net/newland-directors.json')
			.then((res) => res.json())
			.then((body) => {

				(async () => {

					for (let i = 0; i < body.directors.length; i++) {
						let element = body.directors[i];

						await createPage({
							id: 'director' + element.id,
							url: element.slug,
							template: 'about',
							data: element,
						}, siteDir);

						if (i===body.directors.length-1){
							resolve();
						}
					}

				})();

			});

	});

};
