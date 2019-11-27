const Promise = require('bluebird');
const fetch = require('node-fetch');
fetch.Promise = Promise;
const { createPage } = require('./plato/core/createPage');

exports.createPages = siteDir => {
	return new Promise((resolve, reject) => {
		fetch('https://d1ijeakjvj2nvu.cloudfront.net/newland-directors.json')
			.then(res => res.json())
			.then(body => {
				(async () => {
					const country = body.countries[0];
					for (let i = 0; i < country.directors.length; i++) {
						let element = country.directors[i];

						await createPage(
							{
								id: 'director' + element.id,
								url: element.slug,
								template: 'about',
								data: element
							},
							siteDir
						);

						if (i === country.directors.length - 1) {
							resolve();
						}
					}
				})();
			});
	});
};

exports.createGlobalData = () => {
	return new Promise((resolve, reject) => {
		resolve({
			globals: {
				array: [1, 2, 3, 4, 5]
			}
		});
	});
};
