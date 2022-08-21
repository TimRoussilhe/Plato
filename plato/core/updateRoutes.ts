import fse from 'fs-extra';
import path from 'path';
import { Routes, Route } from '../@types/route.js';

// create main route JSON file
// will create the route
// or add to it if it already exists to deal with static + dynamic routes
export const updateRoutes = (routes: Route[]) => {
  return new Promise<Routes>((resolve, reject) => {
    const destinationPath = path.resolve(global.routeDest, './routes.json');
    const exists = fse.existsSync(destinationPath);

    if (exists) {
      fse.readFile(destinationPath).then((data: Buffer) => {
        let obj: Routes = { routes: [] };
        try {
          obj = JSON.parse(data.toString()); // now it's an object
        } catch (e) {
          reject(e);
        }

        obj.routes = [...obj.routes, ...routes]; // add some data
        const json = JSON.stringify(obj); // convert it back to json
        fse
          .writeFile(destinationPath, json, 'utf8') // write it back
          .then(() => resolve(obj))
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
        resolve(routesObject);
      } catch (error) {
        reject();
      }
    }
  });
};
