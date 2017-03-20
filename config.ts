import * as _ from 'lodash';
import * as chalk from 'chalk';
import * as path from 'path';
import * as prettyjson from 'prettyjson';
import * as process from 'process';

import Environments from './enums/environments';

interface AppConfig {
  readonly database: Database;
  readonly env: Environments;
  readonly paths: Paths;
  readonly server: Server;
}

interface Database {
  readonly uri: string;
}

interface Paths {
  readonly enums: string;
  readonly logs: string;
  readonly views: string;
}

interface Server {
  readonly enableHttps: boolean;
  readonly port: number;
}

function buildConfig(): AppConfig {
  require('dotenv').config();

  const config: AppConfig = {
    database: {
      uri: process.env.COMPAN_DATABASE_URI
    },
    env: process.env.NODE_ENV,
    paths: {
      enums: path.resolve(__dirname, './enums'),
      logs: path.resolve(__dirname, './logs'),
      views: path.resolve(__dirname, './views')
    },
    server: {
      enableHttps: process.env.COMPAN_ENABLE_HTTPS === 'true',
      port: process.env.COMPAN_PORT
    }
  };

  logConfig(config);
  checkConfig(config);

  return config;
}

export default buildConfig();

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
