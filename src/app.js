import Express from 'express';
import usersRouter from './routes/users';
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

//User Router with /users route
app.use('/users', cors(), usersRouter);

export default app;
