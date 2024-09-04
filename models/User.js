// models/User.js
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import crypto from 'crypto';

class User {
  static hashPassword(password) {
    return crypto.createHash('sha1').update(password).digest('hex');
  }

  static async findByEmail(email) {
    return dbClient.db.collection('users').findOne({ email });
  }

  static async createUser(email, password) {
    const hashedPassword = this.hashPassword(password);
    const result = await dbClient.db.collection('users').insertOne({ email, password: hashedPassword });
    return result.insertedId;
  }

  static async findById(id) {
    return dbClient.db.collection('users').findOne({ _id: new ObjectId(id) });
  }
}

export default User;
