const {saveRemoteData, updateRoutes} = require('./saveData.js');
const chalk = require('chalk');
const log = console.log;
const print = chalk.grey;
// Things we need for a page
// slug/url
// template
// json filename
// data to create the JSON

exports.createPage = ({id, url, template, data}, siteDir) => {

	return new Promise((resolve, reject) => {

		// create JSON File
		saveRemoteData(JSON.stringify(data), id+'.json', siteDir).then(()=>{});

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
