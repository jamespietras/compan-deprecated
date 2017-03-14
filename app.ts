import * as express from 'express';

import { AppConfig, buildConfig } from './config';

class Server {
  public app: express.Application;
  public config: AppConfig;

  public static bootstrap() : Server {
    return new Server();
  }

  constructor() {
    this.app = express();

    this.setup();
    this.launch();
  }

  ///// Implementation details

  private setup(): void {
    this.config = buildConfig();
  }

  private launch(): void {
    this.app.listen(this.config.port, () => {
      console.log(`Server bootstrap finished on port ${this.config.port}.`);
    });
  }
}

Server.bootstrap();
