// worker.js
// Existing imports...

const userQueue = new Bull('userQueue');

userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  console.log(`Welcome ${user.email}!`);
  // Here you would send an email using a service like Mailgun.
});

console.log('Worker started');
