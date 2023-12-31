import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import { ninjaBuild }  from './config/ninja-build.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    afterAsar: [ninjaBuild],
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({
    setupExe: 'ninja-summer-electron-bitrix.exe'
  }), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy: 'connect-src \'self\' * \'unsafe-eval\'',
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/react/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/electron/preload.ts',
            },
          },
        ],
      },
      "port": 5001
    }),
  ],
};

export default config;
