# 🚀 Local Redis & MongoDB Developer Environment (Day 2)

Welcome! This repository is an educational project designed to help you set up, connect, and learn how to use **Redis** and **MongoDB** locally with a **Node.js (Express)** backend. It uses **Docker Compose** to run the database services in lightweight, isolated containers, making the environment portable and easy to spin up.

---

## 🛠️ Tech Stack & Architecture

This lab consists of:
1. **Express (Node.js)**: A minimalist web framework acting as our backend API.
2. **Redis**: An in-memory key-value data store, running inside a Docker container (version 7-alpine).
3. **MongoDB**: A document-oriented NoSQL database, running inside a Docker container (version 7).
4. **Mongoose**: An ODM (Object Data Modeling) library for MongoDB.
5. **ioRedis**: A robust, full-featured Redis client for Node.js.

---

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
*   [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/)
*   (Optional) [Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/) or PowerShell

---

## 🚀 Getting Started

Follow these steps to run the environment:

### Step 1: Clone and Install Dependencies

Open your terminal in this directory and install the required packages:

```bash
# Using npm
npm install

# Or if you are using bun
bun install
```

### Step 2: Spin Up Redis and MongoDB (Docker)

Start the database services in the background using Docker Compose:

```bash
docker compose up -d
```

> [!NOTE]
> The `-d` flag runs the containers in "detached" mode (in the background).
> If you inspect [docker-compose.yml](file:///d:/Backend_Project/Redis%20by%20chai%20or%20code/Day%20-%202/docker-compose.yml), you will see that:
> *   **Redis** persists its data to a Docker volume named `redis-data` using `--appendonly yes`.
> *   **MongoDB** persists its data to `mongo-data` and initializes a default database named `kushagra_redis`.

To check if the containers are running, run:
```bash
docker ps
```

### Step 3: Start the Backend Server

Start the local development server:

```bash
npm run dev
```

The server will start on [http://localhost:3000](http://localhost:3000).

---

## 🗺️ Understanding the Code & API Endpoints

Our backend code is located inside [src/index.js](file:///d:/Backend_Project/Redis%20by%20chai%20or%20code/Day%20-%202/src/index.js). Here is a breakdown of how the connections and endpoints work:

### 1. Connecting to Redis
We instantiate `ioredis` by passing the connection URL. We default to `localhost` but support configuration via environment variables (useful in production or Docker network setups):
```javascript
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
```

*   **Endpoint: `GET /redis`**
    *   **How it works**: Sends a ping request to Redis. If Redis is alive, it responds with `"PONG"`.
    *   **Test URL**: [http://localhost:3000/redis](http://localhost:3000/redis)
    *   **Response**:
        ```json
        { "redis": "PONG" }
        ```

### 2. Connecting to MongoDB
We use `mongoose` to connect. To avoid opening multiple redundant connections on every request, we check `mongoose.connection.readyState` first:
```javascript
const url = process.env.MONGO_URL || 'mongodb://localhost:27017/kushagra_redis';
if (mongoose.connection.readyState === 0) {
    await mongoose.connect(url);
}
```

*   **Endpoint: `GET /mongo`**
    *   **How it works**: Checks the connection and connects if idle. It returns the database name and connection state.
    *   **Test URL**: [http://localhost:3000/mongo](http://localhost:3000/mongo)
    *   **Response**:
        ```json
        {
          "mongo": "connected",
          "database": "kushagra_redis",
          "status": 1
        }
        ```

### 3. Server Sanity Check
*   **Endpoint: `GET /health`**
    *   **How it works**: Returns a simple health status to verify the server is responsive.
    *   **Test URL**: [http://localhost:3000/health](http://localhost:3000/health)
    *   **Response**:
        ```json
        {
          "message": "All is well!",
          "success": true
        }
        ```

---

## 🧹 Cleaning Up

When you are done experimenting and want to stop the background database containers, run:

```bash
docker compose down
```

If you also want to delete the persistent volumes (e.g., to wipe database state completely):

```bash
docker compose down -v
```

---

## 💡 What You Learned in Day 2
*   How to orchestrate multiple services (Redis & MongoDB) together using a single `docker-compose.yml` file.
*   How to interface with a Redis instance in Node.js using `ioredis` and perform a `.ping()`.
*   How to handle MongoDB connections programmatically with `mongoose` by verifying the `readyState`.
*   How to use environmental variables (`REDIS_URL`, `MONGO_URL`) to dynamically configure database connections.
