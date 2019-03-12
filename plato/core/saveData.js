const fse = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');
const fetch = require('node-fetch');
fetch.Promise = Promise;

const chalk = require('chalk');
const log = console.log;
const print = chalk.grey;

const routeDestPath = path.resolve(__dirname + '/../../shared/routes/real_routes.json');

const saveFile = (destination, data) => {
	return new Promise((resolve, reject) => {
		fse.writeFile(destination, data, 'utf8', () => {
			resolve();
		});
	});
};

exports.saveRemoteData = (data, fileName, siteDir, dataMiddleware) => {
	const destination = path.join(siteDir, fileName);

	let jsonData = data;
	if (dataMiddleware !== null) {
		jsonData = dataMiddleware(data);
	}

	return saveFile(destination, jsonData);
};

exports.saveRemoteDataFromSource = (source, fileName, siteDir) => {
	return new Promise((resolve, reject) => {
		const start = process.hrtime();

		fetch(source)
			.then((res) => res.json())
			.then((body) => {
				const destination = path.join(siteDir, fileName);
				saveFile(destination, JSON.stringify(body)).then(() => {
					const end = process.hrtime(start);
					log(print(` Saved ${fileName} in ${end[1] / 1000000}ms`));
					resolve();
				});
			});
	});
};

exports.updateRoutes = (routes) => {
	return new Promise((resolve, reject) => {
		const exists = fse.existsSync(routeDestPath);

		if (exists) {
			fse.readFile(routeDestPath).then((data) => {
				obj = JSON.parse(data); // now it an object
				obj.routes = [...obj.routes, ...routes]; // add some data
				json = JSON.stringify(obj); // convert it back to json
				fse.writeFile(routeDestPath, json, 'utf8').then(() => resolve()); // write it back
			});
		} else {
			const routesObject = {
				routes,
			};

			fse.writeFile(routeDestPath, JSON.stringify(routesObject), 'utf8').then(() => {
				const exists = fse.existsSync(routeDestPath);
				if (exists) resolve();
				else reject();
			});
		}
	});
};
