const Promise = require('bluebird');
const fetch = require('node-fetch');
const {saveRemoteData, updateRoutes} = require('./saveData.js');
// const buildPage = require('./buildPage.js');
// const fse = require('fs-extra');

fetch.Promise = Promise;


// Things we need for a page
// slug/url
// template
// json filename
// data to create the JSON

const createPage = ({id, url, template, data}, siteDir) => {

	return new Promise((resolve, reject) => {

		// create JSON File
		saveRemoteData(JSON.stringify(data), id+'.json', siteDir).then(()=>{
			console.log('DATA SAVED');
		});

		const route = {
			id,
			url,
			template,
			json: id + '.json',
		};

		updateRoutes([route]).then(() => {
			resolve();
		});

	});

};

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
