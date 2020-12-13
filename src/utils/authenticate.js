import jwt from 'jsonwebtoken';
import Logger from './logger';
import {config} from '../config';
const logger = new Logger('Authentication', 'authenticate.js');

/**
 * @exports
 * authMiddleware for authenticating User
 */
export const authMiddleware = (req, res, next) => {
    const token = req.headers && req.headers.authorization;
    if (token) {
      const decodedJWTData = jwt.verify(token,config.secretkey);
      req.user = decodedJWTData;
      next();
    } else {
      res.status(401).json({
        err: 'unauthorized access',
      });
      logger.silly('Unauthorize access');
    }
  };