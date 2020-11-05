import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Student from '../models/student';
import OptedCourse from '../models/courseWithUsers';
import Course from '../models/course';
import Logger from '../utils/logger';
import { config } from '../config';

/**
 * Student Controller
 */
const logger = new Logger('Controller', 'student.js');



/**
 * @async
 * Opt for course
 *  @param {data}
 */
export const OptCourse = async (data) => {
    logger.silly('in OptCourse');
    try {
        const optedCourse = await OptedCourse.findOne({ studentId: data.studentId });
        logger.info(optedCourse);
        if (optedCourse) {
            logger.info(optedCourse.courseId);
            optedCourse.courseId.push(data.courseId);
            await OptedCourse.findByIdAndUpdate(optedCourse._id, optedCourse, { upsert: true });
        }
        else {
            const courses = await OptedCourse.create({ studentId: data.studentId });
            courses.courseId.push(data.courseId);
            await OptedCourse.findByIdAndUpdate(courses._id, courses, { upsert: true });
        }
    } catch (err) {
        logger.error(err);
        throw new Error(` Err: ${err}`);
    }
};


/**
 * @async
 * Get All Student
 */
export const getAllUsers = async () => {
    try {
        return await Student.find();
    } catch (err) {
        logger.error(err);
        throw new Error(` Err: ${err}`);
    }
};

/**
* @async
* get All courses
*/
export const getAllCourse = async () => {
    try {
        return await Course.find();
    } catch (err) {
        logger.error(err);
        throw new Error(` Err: ${err}`);
    }
};


/**
* @async
* getPopularCourse (more than two student opted for same course)
*/
export const getPopularCourse = async () => {
    try {
        const allCourses = await OptedCourse.find();
        const courses = [];
        allCourses.forEach(element => {
            courses.push(...element.courseId);
        });
        const count = courses.reduce((o, v) => {
            // eslint-disable-next-line security/detect-object-injection
            o[v] = o[v] + 1 || 1;
            return o;
        }, {});

        const duplicate = Object
            .keys(count)
            // eslint-disable-next-line security/detect-object-injection
            .filter(k => count[k] >= 2);
      return await Course.find().where('_id').in(duplicate);

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
export const createOne = async (data) => {
    logger.silly('in createOne');
    try {
        await Student.create(data);
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
export const getOptedCourseWithUsers = async () => {
    logger.silly('in createOne');
    try {
        return await OptedCourse.find().populate('studentId').populate('courseId');
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
        return await Student.findOne({ email: username });
    } catch (err) {
        logger.error(err);
        throw new Error(`findByEmail Err: ${err}`);
    }
};
/**
 * @async
 * Find User by id
 * @param {id}
 */
export const findById = async (id) => {
    logger.silly('in findById');
    try {
        return await Student.findById(id);
    } catch (err) {
        logger.error(err);
        throw new Error(`findById Err: ${err}`);
    }
};




/**
 * @async
 * User Registration method
 * @param {data}
 */

export const register = async (body) => {
    logger.silly('in register');
    const data = { ...body };
    logger.info(JSON.stringify(data, null, 2));
    data.password = await bcrypt.hashSync(data.password, 10);
    await createOne(data);
};
/**
 * @async
 * Student Login method
 * @param {body}
 */
export const login = async (body) => {
    const data = { ...body };
    logger.info(JSON.stringify(data, null, 2));
    try {
        const user = await findByUsername(data.email);
        const isAuth = await bcrypt.compareSync(data.password, user.password);

        logger.info(isAuth);
        if (isAuth) {
            const token = jwt.sign({ id: user._id }, config.secretkey);

            logger.info(isAuth);
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
