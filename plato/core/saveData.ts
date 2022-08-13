import fse from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';
import reporter from '../utils/reporter.js';

const saveFile = (destinationPath, data) => {
	return new Promise((resolve, reject) => {
		fse.writeFile(destinationPath, data, 'utf8', () => {
			resolve(data);
		});
	});
};

export const saveRemoteData = (data, fileName, siteDir) => {
	const destinationPath = path.join(siteDir, fileName);
	return saveFile(destinationPath, data);
};

export const saveRemoteDataFromSource = (source, fileName, siteDir) => {
	return new Promise((resolve, reject) => {
		const start = process.hrtime();

		fetch(source, {})
			.then((res) => res.json())
			.then((body) => {
				const destinationPath = path.join(siteDir, fileName);
				saveFile(destinationPath, JSON.stringify(body)).then(() => {
					const end = process.hrtime(start);
					reporter.info(`Saved remote data ${fileName} in ${end[1] / 1000000}ms`);
					resolve(fileName);
				});
			});
	});
};

export const updateRoutes = (routes) => {
	return new Promise<string>((resolve, reject) => {
		const destinationPath = path.resolve(global.routeDest, './routes.json');
		const exists = fse.existsSync(destinationPath);

		if (exists) {
			fse.readFile(destinationPath).then((data) => {
				let obj;
				try {
					obj = JSON.parse(data); // now it's an object
				} catch (e) {
					reject(e);
				}

				obj.routes = [...obj.routes, ...routes]; // add some data
				const json = JSON.stringify(obj); // convert it back to json
				fse
					.writeFile(destinationPath, json, 'utf8') // write it back
					.then(() => resolve(json))
					.catch((err) => reject(err));
			});
		} else {
			const routesObject = {
				routes,
			};

			fse.mkdirSync(path.dirname(destinationPath), { recursive: true });
			const json = JSON.stringify(routesObject);

			try {
				fse.writeFileSync(destinationPath, json, 'utf8');
				resolve(json);
			} catch (error) {
				reject();
			}
		}
	});
};
