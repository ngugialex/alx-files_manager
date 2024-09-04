// utils/queue.js
import Bull from 'bull';

// Existing fileQueue...
const userQueue = new Bull('userQueue');

export { fileQueue, userQueue };
