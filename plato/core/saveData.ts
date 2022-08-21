import fse from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';
import reporter from '../utils/reporter.js';

const saveFile = (destinationPath: string, data: string) => {
  fse.writeFileSync(destinationPath, data, 'utf8');
};

export const saveRemoteData = (data: string, fileName: string, siteDir: string) => {
  const destinationPath = path.join(siteDir, fileName);
  return saveFile(destinationPath, data);
};

export const saveRemoteDataFromSource = (source: string, fileName: string, siteDir: string) => {
  return new Promise<string>((resolve, reject) => {
    const start = process.hrtime();

    fetch(source, {})
      .then((res) => res.json())
      .then((body) => {
        const destinationPath = path.join(siteDir, fileName);
        saveFile(destinationPath, JSON.stringify(body));
        const end = process.hrtime(start);
        reporter.info(`Saved remote data ${fileName} in ${end[1] / 1000000}ms`);
        resolve(fileName);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
