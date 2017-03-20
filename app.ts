import * as _ from 'lodash';
import * as express from 'express';
import * as helmet from 'helmet';

import config from 'config';
import logger from 'modules/logger';

class Server {
  public app: express.Application;

  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    this.app = express();

    this.enableSecurity();
    this.enableViewEngine();
    this.launch();
  }

  ///// Implementation details

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
