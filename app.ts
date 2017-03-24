import * as _ from 'lodash';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';

import config from 'config';
import logger from 'modules/logger';
import requestLogger from 'middleware/requestLogger';
import router from 'modules/router';

class Server {
  public readonly app: express.Application;

  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    this.app = express();

    this.enableRequestLogger();
    this.enableSecurity();
    this.enableEssentialMiddleware();
    this.enableViewEngine();
    this.enableRouting();

    this.launch();
  }

  ///// Implementation details

  private enableEssentialMiddleware(): void {
    this.app.use(cors());
    logger.server.info(`Cross origin policy enabled.`);

    this.app.use(bodyParser.json());
    logger.server.info(`Body parser enabled.`);
  }

  private enableRequestLogger(): void {
    this.app.use(requestLogger());
    logger.server.info(`Request logger enabled.`);
  }

  private enableRouting(): void {
    this.app.use(config.server.routingRoot, router);
    logger.server.info('Routing enabled.');
  }

  private enableSecurity(): void {
    const securityMiddleware: Array<any> = [
      helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"] } }),
      helmet.dnsPrefetchControl(),
      helmet.frameguard({ action: 'deny' }),
      helmet.hidePoweredBy(),
      helmet.ieNoOpen(),
      helmet.noSniff(),
      helmet.xssFilter(),
      config.server.enableHttps ? helmet.hsts({
        maxAge: 63072000,
        includeSubdomains: true,
        force: true,
        preload: true
      }) : null
    ];

    this.app.use(...(_.compact(securityMiddleware)));
    logger.server.info('Security middleware applied.');
  }

  private enableViewEngine(): void {
    this.app.set('view engine', 'pug');
    this.app.set('views', config.paths.views);
  }

  private launch(): void {
    const port: number = config.server.port;

    this.app.listen(port, () => {
      logger.server.info(`Server bootstrap finished on port ${port}.`);
    });
  }
}

Server.bootstrap();
