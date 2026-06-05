import express from "express";
import redis from "./redisClient.js";
import { BANNER_KEY } from "../config/keyFile.js";

const bannerRouter = express.Router();

// for creating post banner
bannerRouter.post("/post", async (req, res) => {
    try {
        await redis.set(BANNER_KEY, req.body.message || "Welcome to the our site!")
        return res.status(200).json({
            success: true,
            message: "Banner updated"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// for fetching post banner
bannerRouter.get("/banner", async (req, res) => {
    try {
        const message = await redis.get(BANNER_KEY);
        return res.status(200).json({
            success: true,
            message: "Banner fetched",
            data: message
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// for deleting post banner
bannerRouter.delete("/delete", async (req, res) => {
    try {
        await redis.del(BANNER_KEY);
        return res.status(200).json({
            success: true,
            message: "Banner deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// key is exist in db or not
bannerRouter.get("/check", async (req, res) => {
    try {
        const message = await redis.exists(BANNER_KEY);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Banner exist",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

export default bannerRouter;