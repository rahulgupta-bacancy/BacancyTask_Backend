import app from './app';
import DB from './utils/dbConnection';
import {config} from './config';
import Logger from './utils/logger';
const logger = new Logger('server', 'server.js');

/**
 * @async
 * Listen server on port 4444(from enviroment otherwise 3000) with DB connection
 */
const start = async () => {
  await DB();
  const port = config.port;

  app.listen(port, () => {
    logger.info(`Starting express server on port ${port}`);
  });
};

(async () => {
  await start();
})();
