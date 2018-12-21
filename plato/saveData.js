const fse = require('fs-extra');
const path = require('path');
const Promise = require('bluebird');
const fetch = require('node-fetch');

fetch.Promise = Promise;

// const distPath = './build/data/';
const routeDestPath = path.resolve(__dirname + '/../shared/routes/real_routes.json');

const saveFile = (destination, data) => {

	return new Promise((resolve, reject) => {
		fse.writeFile(destination, data, 'utf8', () => {
			resolve();
		});
	});
};

exports.saveRemoteData = (data, fileName, siteDir) => {
	const destination = path.join(siteDir, fileName);
	return saveFile(destination, data);
};

exports.saveRemoteDataFromSource = (source, fileName, siteDir) => {
	return new Promise((resolve, reject) => {
		const start = process.hrtime();

		fetch(source)
			.then((res) => res.json())
			.then((body) => {
				console.log('body', body);
				const destination = path.join(siteDir, fileName);
				saveFile(destination, JSON.stringify(body)).then(() => {
					const end = process.hrtime(start);
					console.log('end[1] / 1000000', end[1] / 1000000 + 'ms');
					resolve();
				});
			});
	});
};

exports.updateRoutes = (routes) => {

	return new Promise((resolve, reject) => {

		const exists = fse.existsSync(routeDestPath);

		if (exists){

			fse.readFile(routeDestPath).then((data)=>{

				obj = JSON.parse(data); // now it an object
				// console.log('routes', ...routes);
				// console.log('...obj.routes', ...obj.routes);
				obj.routes = [...obj.routes, ...routes];// add some data
				json = JSON.stringify(obj); // convert it back to json
				fse.writeFile(routeDestPath, json, 'utf8').then(() => resolve()); // write it back

			});

		} else {

			const routesObject = {
				routes,
			};

			fse.writeFile(routeDestPath, JSON.stringify(routesObject), 'utf8').then(() => {
				console.log('real routes created');
				const exists = fse.existsSync(routeDestPath);
				console.log('exists', exists);
				resolve();
			});
		}
	});
};


