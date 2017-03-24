import * as http from 'http';
import * as responseTime from 'response-time';
import * as requestIp from 'request-ip';

import logger from 'modules/logger';

function hook() {
  return requestLogger.apply({});
}

function requestLogger(): any {
  return responseTime(function(
    req: http.IncomingMessage, res: http.ServerResponse, time: number
  ): any {
    logger.server.info('Request logged.', {
      authorization: req.headers['Authorization'],
      clientIp: requestIp.getClientIp(req),
      endpoint: req.url,
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
