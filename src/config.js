import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

/**
 * @exports
 * Export the configuration variables
 */
export const config = {
  dir: process.env.DIR,
  env: process.env.NODE_ENV,
  db: process.env.DB,
  secretkey: process.env.secretkey ,
  port: process.env.PORT || 3000,
};
