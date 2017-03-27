import * as _ from 'lodash';
import * as chalk from 'chalk';
import * as flat from 'flat';
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
  readonly mongos: boolean;
  readonly poolSize: number;
  readonly uri: string;
}

interface Paths {
  readonly controllers: string;
  readonly enums: string;
  readonly logs: string;
  readonly middleware: string;
  readonly routes: string;
  readonly schemas: string;
  readonly utilities: string;
  readonly views: string;
}

interface Server {
  readonly enableHttps: boolean;
  readonly port: number;
  readonly routingRoot: string;
}

function buildConfig(): AppConfig {
  require('dotenv').config();

  const config: AppConfig = {
    database: {
      mongos: process.env.COMPAN_DATABASE_MONGOS === 'true',
      poolSize: parseInt(process.env.COMPAN_DATABASE_POOL_SIZE),
      uri: process.env.COMPAN_DATABASE_URI
    },
    env: process.env.NODE_ENV,
    paths: {
      controllers: path.resolve(__dirname, './controllers'),
      enums: path.resolve(__dirname, './enums'),
      logs: path.resolve(__dirname, './logs'),
      middleware: path.resolve(__dirname, './middleware'),
      routes: path.resolve(__dirname, './routes'),
      schemas: path.resolve(__dirname, './schemas'),
      utilities: path.resolve(__dirname, './utilities'),
      views: path.resolve(__dirname, './views')
    },
    server: {
      enableHttps: process.env.COMPAN_ENABLE_HTTPS === 'true',
      port: parseInt(process.env.COMPAN_PORT),
      routingRoot: process.env.COMPAN_ROUTING_ROOT
    }
  };

  logConfig(config);
  checkConfig(config);

  return config;
}

export default buildConfig();

///// Implementation details

function checkConfig(config: AppConfig): void {
  const configSize: number = _.size(
    _.keys(flat(config))
  );
  const definedConfigSize: number = _.size(
    _.keys(_.omitBy(flat(config), _.isNil))
  );

  if(configSize !== definedConfigSize) { process.exit(1); }
}

function logConfig(config: AppConfig): void {
  console.log(`\n${chalk.white.bold.bgBlue('[compan]')} Server config:\n`);
  console.log(prettyjson.render(config));
}
