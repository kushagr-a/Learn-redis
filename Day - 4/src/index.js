import express from "express";
import redis from "./redis/redisClient.js";
import mongoose from "mongoose";

import { otp } from "./config/otpGenerate.js";
import { otpKey } from "./config/keyHelperFun.js";

const app = express();

// middleware
app.use(express.json())

// make a redis client
// const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

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

// send otpRoutes
app.post("/sendOtp", async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({
                message: "Phone number is required!",
                success: false
            })
        }

        // generate otp
        const otpCode = otp()

        // set otp in redis
        await redis.set(otpKey(phoneNumber), otpCode, 'EX', 300); // 300 = 5 mins 

        console.log(otpCode);
        // send this otp to user 
        return res.status(200).json({
            message: "OTP sent successfully!",
            success: true,
            otpCode
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error!",
            success: false
        })
    }
});

// verify otp
app.post("/otpVerify", async (req, res) => {
    try {
        const { phoneNumber, otpCode } = req.body;
        if (!phoneNumber || !otpCode) {
            return res.status(400).json({
                message: "Phone number and OTP are required!",
                success: false
            })
        }
        const savedOtp = await redis.get(otpKey(phoneNumber));
        if (!savedOtp) {
            return res.status(404).json({
                message: "OTP not found or expired!",
                success: false
            })
        }
        if (savedOtp !== otpCode) {
            return res.status(400).json({
                message: "Invalid OTP!",
                success: false
            })
        }
        // delete the key
        await redis.del(otpKey(phoneNumber))

        return res.status(200).json({
            message: "OTP verified successfully!",
            success: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error!",
            success: false
        })
    }
})

// get ttl of otp
app.get("/otp/:phone/ttl", async (req, res) => {
    try {
        const ttl = await redis.ttl(otpKey(req.params.phone));
        if (ttl === -1) {
            return res.status(200).json({
                message: "OTP has no expiry!",
                success: true,
                ttl: ttl
            })
        }
        return res.status(200).json({
            message: "OTP TTL fetched successfully!",
            success: true,
            ttl: ttl 
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error!",
            success: false
        })
    }
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})