import express from 'express';
import {
  getOptedCourseWithUsers,
  login,
  register,
  getAllUsers,
  findByUsername,
  getPopularCourse,
  getAllCourse,
  OptCourse
} from '../controllers/student';
import Logger from '../utils/logger';
import  multer  from 'multer';
import path from 'path';
import {authMiddleware} from '../utils/authenticate';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {
        cb(null, `${file.fieldname  }-${  Date.now()  }${path.extname(file.originalname)}`);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter, onError : function(err, next) {
    next(err);
  }});

const router = new express.Router();
const logger = new Logger('Routes', 'student.js');


router.get('/getUsers', authMiddleware,async (req, res) => {
    logger.debug(' GET All student');
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
      res.status(200).end(JSON.stringify(token, null,2));
      return;
    }
    res.status(401).json({
      err: 'Login failed!',
    });
  });


  /**
   * end point /resgister (POST)
   */
  router.post('/register',upload.single('photo'),async (req, res) => {
    try {
      if (!req.body.email || !req.body.password || !req.body.firstname) {
      logger.silly('User Details Not Found');
        res.status(400).json({
          err: 'User Details are imcomplete ',
        });
        return;
      }
      const userexists = await findByUsername(req.body.email);
      logger.info(userexists);
  if(!userexists){
      if(req.file != undefined)
      // eslint-disable-next-line require-atomic-updates
      req.body.image= req.file.path;
      else
      res.status(400).json({
        err: 'image is required',
      });
    await register(req.body);
    res.json({ status: 'ok' });
  }
  else{
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
.get('/listCourse', authMiddleware,async (req, res) => {
  logger.debug(' GET All opted courses');
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
* opt new course
*/

router.post('/optCourse/:Courseid',authMiddleware, async (req, res) => {
  try {
    logger.info( req.user.id);
    const courseData = {
        studentId: req.user.id,
        courseId: req.params.Courseid
    };
    await OptCourse(courseData);
    res.end(JSON.stringify({ status: 'ok' }));
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err,
    });
  }
});

/**
* get request
* get all courses
*/

router.get('/getCourse', authMiddleware,async (req, res) => {
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

  /**
* get request
* get all popular courses
*/
  router.get('/getPopularCourse', async (req, res) => {
    try {
        const courses = await getPopularCourse();
        res.end(JSON.stringify(courses, null, 2));
    } catch (err) {
      res.status(500).json({
        status: 'failed',
        error: err,
      });
    }
  });



export default router;
