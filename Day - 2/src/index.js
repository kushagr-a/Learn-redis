import express from "express";
import Redis from "ioredis";
import mongoose, { mongo } from "mongoose";

const app = express();

// make a redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get("/redis", async (req, res) => {
    const reply = await redis.ping();
    return res.status(200).json({ redis: reply });
})

// make a mongoose connection
app.get("/mongo", async (req, res) => {
    const url = process.env.MONGO_URL || 'mongodb://localhost:27017/kushagra_redis';
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(url)
    }
    res.status(201).json({
        mongo: "connected",
        database: mongoose.connection.name,
        status: mongoose.connection.readyState,
    })
})

app.get("/health", (req, res) => {
    res.status(200).json({
        message: "All is well!",
        success: true
    })
})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})