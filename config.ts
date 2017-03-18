import * as _ from 'lodash';
import * as chalk from 'chalk';
import * as path from 'path';
import * as prettyjson from 'prettyjson';
import * as process from 'process';

import Environments from './enums/environments';

export interface AppConfig {
  readonly env: Environments;
  readonly paths: Paths;
  readonly server: Server;
  readonly version: string;
}

interface Paths {
  readonly enums: string;
  readonly views: string;
}

interface Server {
  readonly enableHttps: boolean;
  readonly port: number;
}

export function buildConfig(): AppConfig {
  require('dotenv').config();

  const config: AppConfig = {
    env: process.env.NODE_ENV,
    paths: {
      enums: path.resolve(__dirname, './enums'),
      views: path.resolve(__dirname, './views')
    },
    server: {
      enableHttps: process.env.COMPAN_ENABLE_HTTPS === 'true',
      port: process.env.COMPAN_PORT
    },
    version: process.env.COMPAN_VERSION
  };

  logConfig(config);
  checkConfig(config);

  return config;
}

///// Implementation details

function checkConfig(config: AppConfig): void {
  const configSize: number = _.size(_.keys(config));
  const definedConfigSize: number = _.size(_.keys(_.omitBy(config, _.isNil)));

  if(configSize !== definedConfigSize) { process.exit(1); }
}

function logConfig(config: AppConfig): void {
  console.log(`\n${chalk.white.bold.bgBlue('[compan]')} Server config:\n`);
  console.log(prettyjson.render(config));
}
