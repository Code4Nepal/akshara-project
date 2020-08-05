const taskQueue = require('../queue');
const taskPull = require('./taskPull');
const taskCreateContent = require('./taskCreateContent');

taskQueue.process(async (job) => {
  const { task } = job.data;
  console.log(`Started: ${task}`);
  try {
    if (task === 'pull') {
      await taskPull();
    }
    if (task == 'create_content') {
      await taskCreateContent(job.data.body);
    }
  } catch (err) {
   console.log(err);
  }
  return console.log(`Ended: ${task}`);
});
