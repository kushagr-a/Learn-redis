import Redis from "ioredis";

// creating a redis client
const redis = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379"
);

export default redis;