import mongoose from 'mongoose';
import { config } from '../config';

/**
 * @exports
 * MongoDb Connection
 */
export default async () => {
  try {
    const conn = await mongoose.connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return conn;
  } catch (err) {
    throw new Error(`MongoDb Connection Error ${err}`);
  }
};
