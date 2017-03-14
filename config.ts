import * as _ from 'lodash';
import Environments from './enums/environments';
import * as path from 'path';
import * as process from 'process';

export interface AppConfig {
  readonly env: Environments;
  readonly paths: Paths;
  readonly port: number;
}

export interface Paths {
  readonly enums: string;
}

export function buildConfig(): AppConfig {
  require('dotenv').config();

  const config: AppConfig = {
    env: process.env.NODE_ENV,
    paths: {
      enums: path.resolve(__dirname, './enums')
    },
    port: process.env.COMPAN_PORT
  };

  checkConfig(config);

  return config;
}

///// Implementation details

function checkConfig(config: AppConfig): void {
  const configSize: number = _.size(_.keys(config));
  const definedConfigSize: number = _.size(_.keys(_.omitBy(config, _.isNil)));

  if(configSize !== definedConfigSize) { process.exit(0); }
}
