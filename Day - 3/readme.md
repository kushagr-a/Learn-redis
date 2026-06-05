# 🚀 Site Banner Management API with Redis (Day - 3)

Welcome to **Day 3** of the Redis learning journey! 

In Day 2, we learned how to spin up a multi-container environment (Redis + MongoDB) and verify connection status. In **Day 3**, we take a massive step forward: we are building a real-world use case—a dynamic **Site Banner Management API**—that implements full CRUD operations (Create, Read, Update, Delete, and Check) on a configuration key stored in **Redis**.

This guide is designed to be highly educational, explaining both the architecture of our modular codebase and the underlying Redis operations.

---

## 🛠️ Tech Stack & Architecture

This application utilizes:
1. **Express (Node.js)**: A lightweight web framework to serve our REST API.
2. **Redis (v7-alpine)**: A high-performance, in-memory data store running in a Docker container, used to cache and manage our dynamic site banner.
3. **MongoDB (v7)**: A NoSQL document database running in a Docker container.
4. **Mongoose**: An ODM (Object Data Modeling) library for MongoDB connectivity.
5. **ioRedis**: A robust, feature-rich Redis client for Node.js.


---

## 📋 Prerequisites

Make sure you have the following tools installed:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with Docker Compose)
*   [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/)
*   An API Client like Postman, Bruno, or `curl` (terminal client)

---

## 🚀 Getting Started

Follow these steps to set up and start the application:

### Step 1: Install Dependencies
Navigate to this directory in your terminal and install packages:
```bash
# Using npm
npm install

# Or if you prefer Bun
bun install
```

### Step 2: Start Redis & MongoDB Containers
Run the following command to boot up the background database services:
```bash
docker compose up -d
```
> [!NOTE]
> The `-d` flag runs containers in detached mode.
> If you inspect the [docker-compose.yml](file:///d:/Backend_Project/Redis%20by%20chai%20or%20code/Day%20-%203/docker-compose.yml), you'll notice:
> - **Redis** runs alpine tag, maps to host port `6379`, and persists cache to `redis-data` volume using AOF (Append-Only File) persistence (`--appendonly yes`).
> - **MongoDB** maps to port `27017` and persists data to the `mongo-data` volume.

### Step 3: Run the Server
Launch the Express server:
```bash
npm run dev
```
The application will listen on [http://localhost:3000](http://localhost:3000).

---

## 💡 Redis Operations Deep Dive

In [src/redis/postBanner.js](file:///d:/Backend_Project/Redis%20by%20chai%20or%20code/Day%20-%203/src/redis/postBanner.js), we use four primary Redis commands:

### 1. `SET` (`redis.set(key, value)`)
- **Concept**: Stores the string value at the specified key. If the key already holds a value, it is overwritten, regardless of its type.
- **Complexity**: $O(1)$
- **Usage**: Used to write or update the banner message.

### 2. `GET` (`redis.get(key)`)
- **Concept**: Retrieves the value of the specified key. If the key does not exist, it returns `null`.
- **Complexity**: $O(1)$
- **Usage**: Fetches the currently stored banner message.

### 3. `DEL` (`redis.del(key)`)
- **Concept**: Removes the specified key from the database.
- **Complexity**: $O(1)$
- **Usage**: Deletes the banner key, simulating removing the site banner.

### 4. `EXISTS` (`redis.exists(key)`)
- **Concept**: Checks if a key exists in the database. Returns `1` if the key exists, and `0` if it does not.
- **Complexity**: $O(1)$
- **Usage**: Checks if a banner is active without fetching its content, saving bandwidth.

---

## 🗺️ API Playbook & Testing Guide

All banner endpoints are prefixed with `/api`. Here is how they work and how to test them:

### 1. Create/Update Banner
Saves or overrides the banner message in Redis.

*   **Method**: `POST`
*   **Endpoint**: `/api/post`
*   **Request Body** (JSON):
    ```json
    {
      "message": "Welcome to our Special Summer Sale! ☀️"
    }
    ```
*   **Test with `curl`**:
    ```bash
    curl -X POST http://localhost:3000/api/post \
      -H "Content-Type: application/json" \
      -d "{\"message\": \"Welcome to our Special Summer Sale! ☀️\"}"
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Banner updated"
    }
    ```

### 2. Read Banner
Retrieves the banner message from Redis.

*   **Method**: `GET`
*   **Endpoint**: `/api/banner`
*   **Test with `curl`**:
    ```bash
    curl http://localhost:3000/api/banner
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Banner fetched",
      "data": "Welcome to our Special Summer Sale! ☀️"
    }
    ```

### 3. Check Banner Existence
Checks if the banner exists in Redis without loading the entire value.

*   **Method**: `GET`
*   **Endpoint**: `/api/check`
*   **Test with `curl`**:
    ```bash
    curl http://localhost:3000/api/check
    ```
*   **Response (if exists)**:
    ```json
    {
      "success": true,
      "message": "Banner exist"
    }
    ```
*   **Response (if deleted/not found)**:
    ```json
    {
      "success": false,
      "message": "Banner not found"
    }
    ```

### 4. Delete Banner
Deletes the banner message key from Redis.

*   **Method**: `DELETE`
*   **Endpoint**: `/api/delete`
*   **Test with `curl`**:
    ```bash
    curl -X DELETE http://localhost:3000/api/delete
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Banner deleted"
    }
    ```

---

## 🔌 Connection Utility Endpoints

We preserve the core connection checks from Day 2:
*   **Redis Ping (`GET /redis`)**: Returns `{"redis": "PONG"}` to check connectivity.
*   **Mongo Connection State (`GET /mongo`)**: Initializes mongoose and returns database details.
*   **Health Check (`GET /health`)**: Verifies express server responsiveness.

---

## 🧹 Cleaning Up

To stop container execution and clean up resources:

```bash
# Stop containers
docker compose down

# Stop containers and destroy volumes (wipes database cache/data)
docker compose down -v
```

---

## 💡 What You Learned in Day 3
*   **Redis Key-Value CRUD**: Harnessing `.set()`, `.get()`, `.del()`, and `.exists()` to build dynamic real-world features.
*   **API Design Patterns**: Structuring standard HTTP verbs (`POST`, `GET`, `DELETE`) to map perfectly to Redis operations.
