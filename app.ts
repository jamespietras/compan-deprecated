import * as _ from 'lodash';
import * as express from 'express';
import * as helmet from 'helmet';

import { AppConfig, buildConfig } from './config';

class Server {
  public app: express.Application;
  public config: AppConfig;

  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    this.app = express();
    this.loadConfig();

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
      this.config.server.enableHttps ? helmet.hsts({
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
    this.app.set('views', this.config.paths.views);
  }

  private loadConfig(): void {
    this.config = buildConfig();
  }

  private launch(): void {
    const port: number = this.config.server.port;

    this.app.listen(port, () => {
      console.log(`Server bootstrap finished on port ${port}.`);
    });
  }
}

Server.bootstrap();
