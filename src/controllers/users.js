import jwt from 'jsonwebtoken';
import Users from '../models/users';
import Logger from '../utils/logger';
import {config} from '../config';

/**
 * Users Controller
 */
const logger = new Logger('Controller', 'users.js');



/**
 * @async
 * Get All Users and pass skip for the number of records need to skipped
 */
export const getAllUsers = async (skip) => {
    try {
        return await Users.find({}).skip(skip).limit(4);
    } catch (err) {
        logger.error(err);
        throw new Error(` Err: ${err}`);
    }
};



/**
 * @async
 * Create User
 *  @param {data}
 */
export const createUsers = async (data) => {
    logger.silly('Create Users');
    try {
      await Users.create(data);
    } catch (err) {
    logger.error(err);
      throw new Error(` Err: ${err}`);
    }
  };



/**
 * @async
 * User Login method
 * @param {body}
 */
export const login = async (body) => {
  const data = { ...body };
  logger.info(JSON.stringify(data, null, 2));
  try {

    if(data.email.toLowerCase() == 'admin@gmail.com' && data.password == 'admin'){

        const token= jwt.sign({ role:'user'}, config.secretkey);
    
      logger.info(token);
      return {
        token: token
    };
       }
    
    return false;
  } catch (err) {
    logger.error(err);
    return false;
  }
};
