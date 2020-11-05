import express from 'express';
import {
  getOptedCourseWithUsers,
  createCourse,
  login,
  register,
  getAllUsers,
  findByUsername,
  getAllCourse
} from '../controllers/admin';
import Logger from '../utils/logger';

import { authMiddleware, verifyAdmin } from '../utils/authenticate';
const router = new express.Router();
const logger = new Logger('Routes', 'admin.js');


router.get('/getUsers', async (req, res) => {
  logger.debug('Quotes GET All');
  try {
    const user = await getAllUsers();
    res.end(JSON.stringify(user, null, 2));
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err,
    });
  }
});

/**
 * end point /login (POST)
 */
router.post('/login', async (req, res) => {
  if (!req.body.email && !req.body.password) {
    logger.silly('Credential Not Found');
    res.status(401).json({
      err: 'Username and Password are required',
    });
  }
  const token = await login(req.body);
  if (token) {
    logger.silly('Successfully logged In');
    res.status(200).end(JSON.stringify(token, null, 2));
    return;
  }
  res.status(401).json({
    err: 'Login failed!',
  });
});


/**
 * end point /resgister (POST)
 */
router.post('/register', async (req, res) => {
  try {
    if (!req.body.email && !req.body.password) {
      logger.silly('User Details Not Found');
      res.status(401).json({
        err: 'username and Password are required',
      });
      return;
    }
    const userexists = await findByUsername(req.body.email);
    if (!userexists) {
      await register(req.body);
      res.json({ status: 'ok' });
    }
    else {
      res.status(400).json({
        err: 'username exist',
      });
      return;
    }
  } catch (err) {
    res.end(JSON.stringify(err));
  }
});

/**
* GET Request
* response in json with all courses
*/
router
  .get('/listCourse', authMiddleware, verifyAdmin, async (req, res) => {
    logger.debug('Quotes GET All');
    try {
      const user = await getOptedCourseWithUsers();
      res.end(JSON.stringify(user, null, 2));
    } catch (err) {
      res.status(500).json({
        status: 'failed',
        error: err,
      });
    }
  });


/**
* POST request
* Create New course
*/

router.post('/addCourse', authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const data = req.body;
    logger.info(JSON.stringify(data, null, 2));
    await createCourse(data);
    res.end(JSON.stringify({ status: 'ok' }));
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err,
    });
  }
});

router.get('/getCourse', authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const courses = await getAllCourse();
    res.end(JSON.stringify(courses, null, 2));
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err,
    });
  }
});




export default router;
