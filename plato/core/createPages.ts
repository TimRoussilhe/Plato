import { saveRemoteData } from './saveData.js';
import { updateRoutes } from './updateRoutes.js';
import { Routes, Route } from '../@types/route.js';

/**
 * Create a page.
 * This method let you create a page from the plato-node.js file
 * A page, is an item of the routes Object
 * A page is composed of the following element:
 *   - index ( used to match the route later etc...)
 * 	 - url ( the slug of the page )
 * 	 - template id ( template name to be match )
 * 	 - data *optional ( the path of remote data )
 *   - json ( the name of the json local data )
 */
export const createPages = (pagesProps: Route[], siteDir: string) => {
  return new Promise<Routes>(async (resolve, reject) => {
    // create JSON Files
    pagesProps.forEach(({ data, id }) => {
      saveRemoteData(JSON.stringify(data), id + '.json', siteDir + '/data/');
    });

    const routes = pagesProps.map(({ id, url, template }): Route => {
      return {
        id,
        url,
        template,
        json: id + '.json',
      };
    });

    try {
      const activeRoutes = await updateRoutes(routes);
      resolve(activeRoutes);
    } catch (error) {
      reject(error);
    }
  });
};
