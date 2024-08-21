const Queue = require("bull");
const processQueue = new Queue("processQueue", "redis://127.0.0.1:6379");

processQueue.process(async (job, done) => {
  // Here we would handle the job, e.g., process data, batch jobs...
  done();
});

module.exports = {
  addJob(data) {
    processQueue.add(data);
  },
};
