import * as express from 'express';

import examplesCtrl from 'controllers/examples';
import methodNotAllowedHandler from 'utilities/methodNotAllowedHandler';

const router: express.Router = express.Router();

router
  .get('/', examplesCtrl.root)
  .all('/', methodNotAllowedHandler);

export default router;
