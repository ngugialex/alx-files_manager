// controllers/UsersController.js
import User from '../models/User';
import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';
import { userQueue } from '../utils/queue';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const userId = await User.createUser(email, password);

    userQueue.add({ userId });

    res.status(201).json({ id: userId, email });
  }

  // Other methods...
}

export default UsersController;
