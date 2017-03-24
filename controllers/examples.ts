import * as HttpStatus from 'http-status-codes';

import RouteParams from 'utilities/routeParams';

class ExamplesCtrl {
  public root({ res }: RouteParams): void {
    res.status(HttpStatus.OK).json({ success: true });
  }
}

export default new ExamplesCtrl();
