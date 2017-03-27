import * as _ from 'lodash';
import * as mongoose from 'mongoose';

import config from 'config';
import { Deferred, defer } from 'utilities/toolbox';
import logger from 'modules/logger';

import exampleSchema from 'schemas/example';

interface SchemaList {
  [property: string]: mongoose.Schema;
}

class Database {
  public static init(): Promise<any> {
    const deferred: Deferred = defer();

    (<any>mongoose).Promise = Promise;
    const db = mongoose.connection;

    db.on('error', (error: any) => {
      logger.database.error('Database connection error.', error);
      process.exit(0);
    });

    db.once('connected', () => {
      logger.database.info('Database connection established.')
      deferred.resolve(null);
    });

    mongoose.connect(config.database.uri, {
      mongos: config.database.mongos,
      replset: {
        poolSize: config.database.poolSize
      },
      server: {
        poolSize: config.database.poolSize,
        reconnectInterval: 500,
        reconnectTries: 60,
        socketOptions: { keepAlive: 120 }
      }
    });

    return deferred.promise;
  }

  public static generateModels(): void {
    const allSchemas: SchemaList = {
      example: exampleSchema
    };

    _.forOwn(allSchemas, (schema, schemaName) =>{
      schema.set('strict', 'throw');
      schema.post('save', Database.logSave);
      schema.post('remove', Database.logRemove);

      mongoose.model(<string>schemaName, schema);
    });

    logger.database.info('Models generated.');
  }

  public static logSave(document: mongoose.Document): void {
    const metadata: any = document.toObject();
    metadata._id = String(metadata._id);

    logger.database.silly('Created a document.', metadata);
  }

  public static logRemove(document: mongoose.Document): void {
    const metadata: any = document.toObject();
    metadata._id = String(metadata._id);

    logger.database.silly('Removed a document.', metadata);
  }
}

export default Database;
