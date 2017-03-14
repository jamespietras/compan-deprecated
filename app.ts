import * as express from 'express';

class Server {
  public app: express.Application;

  public static bootstrap() : Server {
    return new Server();
  }

  constructor() {
    this.app = express();

    this.launch();
  }

  ///// Implementation details

  private launch() {
    this.app.listen(8080, () => {
      console.log('Server bootstrap finished.');
    });
  }
}

Server.bootstrap();
