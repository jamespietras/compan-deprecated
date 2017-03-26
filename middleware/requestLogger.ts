import { Request, Response } from 'express';
import * as responseTime from 'response-time';
import * as requestIp from 'request-ip';
import * as nodeUrl from 'url';

import logger from 'modules/logger';

function hook() {
  return requestLogger.apply({});
}

function requestLogger(): any {
  return responseTime(function(req: Request, res: Response, time: number): any {
    const urlObject: nodeUrl.URL = new nodeUrl.URL(nodeUrl.format({
      host: req.get('host'),
      pathname: req.originalUrl || req.url,
      protocol: req.protocol
    }));

    logger.server.info('Request logged.', {
      authorization: req.headers['Authorization'],
      clientIp: requestIp.getClientIp(req),
      endpoint: urlObject.pathname,
      httpVersion: req.httpVersion,
      method: req.method,
      responseTime: `${time.toFixed(4)}ms`,
      statusCode: res.statusCode,
      timestamp: Date.now(),
      uid: require('cuid')(),
      userAgent: req.headers['User-Agent']
    });
  });
}

export default hook;
