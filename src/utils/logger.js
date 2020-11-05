import winston from 'winston';
import { config } from '../config';
/**
 * @exports
 * Logger class for logging
 */

export default class Logger {
  constructor(module, jsFile, logFile = 'app.log') {
    this.level = config.env === 'production' ? 'error' : 'silly';
    this.prefix = `${module}[${jsFile}]`;
    this.setLogger(logFile);
  }
  setLogger(logFile) {
    this.logger = winston.createLogger({
      level: this.level,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
        new winston.transports.File({ filename: logFile }),
      ],
    });
  }
/**
 * Logging Methods For Different Level
 */
  silly(arg){
      this.logger.silly(`${this.prefix}: ${arg}`);
  }
  debug(arg){
      this.logger.debug(`${this.prefix}: ${arg}`);
  }
  info(arg){
      this.logger.info(`${this.prefix}: ${arg}`);
  }
  error(arg){
      this.logger.error(`${this.prefix}: ${arg}`);
  }
}

