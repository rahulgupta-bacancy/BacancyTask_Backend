import Express from 'express';
import adminRouter from './routes/admin';
import studentRouter from './routes/student';
import cors from 'cors';


const app = new Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

/**
 * Allow all request using Cors()
 * app.options() used to show which http methods are allowed
 * Cors module help in Cross origin request
 */
app.options('*',cors());

/**
 * Req for end point /admin ,/student
 */
app.use('/admin', cors(), adminRouter);
app.use('/student', cors(), studentRouter);

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(500).json({
        status: 'failed',
        error: err,
      });
});
export default app;
