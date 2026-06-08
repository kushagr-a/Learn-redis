import Redis from "ioredis";

// creating a redis client
const redisClient = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379"
);

redisClient.on('connect', () => {
    console.log("Redis is connected");
});

redisClient.on('error', (error) => {
    console.log("Redis is not connected");
    console.log(error);
});

export default redisClient;