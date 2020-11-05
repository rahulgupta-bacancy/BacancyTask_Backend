import jwt from 'jsonwebtoken';
import Logger from './logger';
import {config} from '../config';
const logger = new Logger('Authentication', 'authenticate.js');

/**
 * @exports
 * authMiddleware for checking Ordinary User
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
  /**
 * @exports
 * verifyAdmin for checking Admin User
 */
  export const  verifyAdmin= async function(req,res,next){
    logger.info('userid',req.user.id);
      if(req.user.role === 'admin'){
      next();
      }
      else{
    logger.info('Unauthorize Admin access');
      res.status(403).json({
      err: 'unauthorized Admin access',
    });
      }
  };