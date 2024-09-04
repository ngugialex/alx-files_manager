// controllers/AuthController.js
import User from '../models/User';
import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';

class AuthController {
  static async getConnect(req, res) {
    const auth = req.headers.authorization || '';
    const [type, credentials] = auth.split(' ');

    if (type !== 'Basic' || !credentials) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [email, password] = Buffer.from(credentials, 'base64').toString('ascii').split(':');
    const user = await User.findByEmail(email);

    if (!user || user.password !== User.hashPassword(password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    await redisClient.setValue(`auth_${token}`, user._id.toString(), 24 * 60 * 60); // 24 hours

    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    await redisClient.deleteKey(`auth_${token}`);
    res.status(204).send();
  }
}

export default AuthController;
