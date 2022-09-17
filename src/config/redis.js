const redis = require("redis");

const redisPassword = process.env.REDIS_PASWORD;
const redisHost = process.env.REDIS_HOST;
const redistPort = process.env.REDIS_PORT;

// REMOTE :
// 1. install redis-cli global = https://www.npmjs.com/package/redis-cli
// 2. rdcli -h <host> -a <password> -p <port>
// 2. rdcli -h redis-11247.c82.us-east-1-2.ec2.cloud.redislabs.com -a wA6Nd2Pm9gvG5oZ8M7qkbn2vVymD0tnF -p 11247

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
