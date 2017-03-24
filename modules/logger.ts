import * as bytes from 'bytes';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as moment from 'moment';
import * as prettyjson from 'prettyjson';
import * as winston from 'winston';

import ApiModule from 'enums/apiModule';
import config from 'config';
import Environments from 'enums/environments';

class Logger {
  public readonly database: winston.LoggerInstance;
  public readonly server: winston.LoggerInstance;

  constructor() {
    setupLogFolder();
    attachExceptionHandler();

    this.database = this.getLoggerInstance(ApiModule.DATABASE);
    this.server = this.getLoggerInstance(ApiModule.SERVER);
  }

  private getLoggerInstance(moduleName: ApiModule): winston.LoggerInstance {
    const logger: winston.LoggerInstance = new winston.Logger();

    attachConsoleTransport(logger, moduleName);
    attachMongoTransport(logger, moduleName);

    return logger;
  }
}

export default new Logger();

///// Implementation details

function attachConsoleTransport(
  logger: winston.LoggerInstance, moduleName: ApiModule
): void {
  if(config.env === Environments.DEVELOPMENT) {
    logger.add(winston.transports.Console, {
      colorize: true,
      level: 'silly',
      label: moduleName,
      timestamp: () => {
        return moment().format('DD/MMMM/YYYY HH:mm:ss');
      },
      formatter: consoleFormatter
    });
  }
}

function attachExceptionHandler(): void {
  winston.handleExceptions(new winston.transports.File({
    filename: `${config.paths.logs}/exceptions.log`
  }));
}

function attachMongoTransport(
  logger: winston.LoggerInstance, moduleName: ApiModule
): void {
  logger.add(require('winston-mongodb').MongoDB, {
    db: config.database.uri,
    collection: 'logs',
    level: config.env === Environments.DEVELOPMENT ? 'silly' : 'info',
    storeHost: false,
    decolorize: true,
    includeIds: false,
    cappedSize: bytes('1gB'),
    label: moduleName
  });
}

function getColorizedPrefix(level: string, moduleName: ApiModule): string {
  const levelPart: string = chalk.bold(`[${level.toUpperCase()}]`);
  const modulePart: string = chalk.bold(`(${moduleName})`);
  let completePrefix = levelPart + modulePart;

  switch(level) {
    case 'info':
      completePrefix = chalk.cyan(completePrefix);
      break;
    case 'warn':
      completePrefix = chalk.yellow(completePrefix);
      break;
    case 'error':
      completePrefix = chalk.red(completePrefix);
      break;
    default:
      completePrefix = chalk.white(completePrefix);
      break;
  }

  return completePrefix;
}

function consoleFormatter(options: winston.LoggerOptions): string {
    const message: string = options.message || '';
    const timestamp: string = options.timestamp();
    const level: string = options.level ? options.level : 'UNSPECIFIED';
    const prefix: string = getColorizedPrefix(level, options.label);
    const meta: string = prettyjson.render(options.meta);

    return `${timestamp} ${prefix}: ${message} ${meta ? `\n${meta}` : ''}`;
}

function setupLogFolder(): void {
  if(!fs.existsSync(config.paths.logs)) {
    fs.mkdirSync(config.paths.logs);
  }
}
