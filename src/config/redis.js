const redis = require("redis");

const redisPassword = "wA6Nd2Pm9gvG5oZ8M7qkbn2vVymD0tnF";
const redisHost = "redis-11247.c82.us-east-1-2.ec2.cloud.redislabs.com";
const redistPort = "11247";

// REMOTE :
// 1. install redis-cli global = https://www.npmjs.com/package/redis-cli
// 2. rdcli -h <host> -a <password> -p <port>
// 2. rdcli -h redis-11606.c240.us-east-1-3.ec2.cloud.redislabs.com -a ytCJxzIg640RA0qX5tMC8ciLwx08AS92 -p 11606

// const client = redis.createClient();
const client = redis.createClient({
  socket: {
    host: redisHost,
    port: redistPort,
  },
  password: redisPassword,
});

(async () => {
  client.connect();
  client.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("You're connected db redis ...");
  });
})();

module.exports = client;
