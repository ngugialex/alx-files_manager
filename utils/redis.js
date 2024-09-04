import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => console.error('Redis Client Error', err));

    this.get = promisify(this.client.get).bind(this.client);
    this.set = promisify(this.client.set).bind(this.client);
    this.del = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async getValue(key) {
    return this.get(key);
  }

  async setValue(key, value, duration) {
    await this.set(key, value, 'EX', duration);
  }

  async deleteKey(key) {
    await this.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;

