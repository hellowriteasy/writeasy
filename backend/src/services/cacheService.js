const redis = require("redis");
const client = redis.createClient();

client.on("error", function (error) {
  console.error("Redis error: ", error);
});

module.exports = {
  async get(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (err, data) => {
        if (err) reject(err);
        resolve(data ? JSON.parse(data) : null);
      });
    });
  },

  async set(key, value, ttl = 3600) {
    client.set(key, JSON.stringify(value), "EX", ttl);
  },
};
