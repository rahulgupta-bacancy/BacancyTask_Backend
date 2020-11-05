import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Admin from '../models/admin';
import Course from '../models/course';
import Logger from '../utils/logger';
import OptedCourse from '../models/courseWithUsers';
import {config} from '../config';

/**
 * Admin Controller
 */
const logger = new Logger('Controller', 'admin.js');



  /**
 * @async
 * get opted course with student
 */
export const getOptedCourseWithUsers = async () => {
    logger.silly('get opted course with student');
    try {
    return  await OptedCourse.find().populate('studentId').populate('courseId');
    } catch (err) {
    logger.error(err);
      throw new Error(`getOptedCourseWithUsers Err: ${err}`);
    }
  };

/**
 * @async
 * Create Admin User
 *  @param {data}
 */
export const createOne = async (data) => {
  logger.silly('Create Admin User');
  try {
    await Admin.create(data);
  } catch (err) {
  logger.error(err);
    throw new Error(` Err: ${err}`);
  }
};



/**
 * @async
 * Create Course
 *  @param {data}
 */
export const createCourse = async (data) => {
    logger.silly('Create Course');
    try {
      await Course.create(data);
    } catch (err) {
    logger.error(err);
      throw new Error(` Err: ${err}`);
    }
  };


/**
 * @async
 * FInd User by Username
 * @param {username}
 */
export const findByUsername = async (username) => {
  logger.silly('in findByUsername');
  try {
    return await Admin.findOne({email:username});
  } catch (err) {
    logger.error(err);
    throw new Error(`findByEmail Err: ${err}`);
  }
};



/**
 * @async
 * Admin Registration method
 * @param {data}
 */

export const register = async (body) => {
  logger.silly('in admin register');
  const data = { ...body };
  logger.info(JSON.stringify(data, null, 2));
  data.password = await bcrypt.hashSync(data.password, 10);
  await createOne(data);
};
/**
 * @async
 * Admin Login method
 * @param {body}
 */
export const login = async (body) => {
  const data = { ...body };
  logger.info(JSON.stringify(data, null, 2));
  try {
    const user = await findByUsername(data.email);
    const isAuth = await bcrypt.compareSync(data.password, user.password);

    logger.info(user._id);
     if (isAuth) {
     const token= jwt.sign({ id: user._id ,role:'admin'}, config.secretkey);

      logger.info(token);
      return {
        id: user._id,
        token: token
    };
       }
    return false;
  } catch (err) {
    logger.error(err);
    return false;
  }
};
