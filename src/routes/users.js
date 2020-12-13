import express from 'express';
import {
  createUsers,
  login,
  getAllUsers
} from '../controllers/users';
import Logger from '../utils/logger';

import { authMiddleware } from '../utils/authenticate';
const router = new express.Router();
const logger = new Logger('Routes', 'users.js');


/**
 * Get All users if skip is not passed from user side 0 will be considered
 */
router.get('/getUsers', authMiddleware, async (req, res) => {
  logger.debug(' GET All Users');
  try {
    let skip = parseInt(req.query.skip);
    console.log(skip)
    const user = await getAllUsers(skip);
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
      err: 'Username/Email and Password are required',
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
router.post('/createUser', authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    logger.info(JSON.stringify(data, null, 2));
    await createUsers(data);
    res.end(JSON.stringify({ status: 'ok' }));
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err,
    });
  }
});





export default router;
