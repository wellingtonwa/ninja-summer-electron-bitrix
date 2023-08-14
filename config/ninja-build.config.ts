import { mkdirSync, renameSync, copyFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import info from '../package.json';

export const ninjaBuild = (file: string, _1 = {}, _2 = {}, _3 = {}, callback: (err?: Error | null) => void) => {
  const path = file.slice(0, -4);
  const app = join(path, 'app');

  const oldAsar = join(path, 'app.asar');
  const newAsar = join(app, 'core.asar');

  mkdirSync(app);
  renameSync(oldAsar, newAsar);

  copyFileSync('./src/bootstrap/index.js', join(app, 'index.js'));

  writeFileSync(join(app, 'package.json'), JSON.stringify({
    name: info.name,
    version: info.version,
    description: info.description,
    author: info.author,
    main: 'index.js',
  }));

  callback(null);
};
