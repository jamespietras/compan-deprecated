import * as express from 'express';

import examplesRoutes from 'routes/examples';

function buildRouter(): express.Router {
  const router: express.Router = express.Router();

  router.use('/examples', examplesRoutes);

  return router;
}

export default buildRouter();
