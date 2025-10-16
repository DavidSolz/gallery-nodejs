# 📸 Gallery — Photo Management Application

![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build Status](https://img.shields.io/badge/build-passing-success)

--

## 📘 Table of Contents

1. [Overview](#1-overview)
2. [Technologies & Packages Used](#2--technologies--packages-used)
3. [Installation & Setup](#3--installation--setup)
4. [Application Access](#4--application-access)
5. [Key Features & Implementation Notes](#5--key-features--implementation-notes)

--

## 1. Overview

**Gallery** is a web application for managing photo galleries, users, comments, and statistics.
It is built with **Node.js**, **Express.js**, and **MongoDB**.

📘 **API documentation** is available in OpenAPI format at:
`/api-docs`

### 🔒 Access & Permissions

**Regular User** can manage only their own data:
- Their galleries
- Their images
- Their comments

**Administrator** has full access to all application resources:
- Manage all users
- View and modify all galleries, images, and comments
- Access both global and individual statistics

> 💬 Comments are accessible by opening a specific image.

---

## 2. 🧩 Technologies & Packages Used

- **Node.js** — JavaScript runtime for server-side development
- **Express.js** — Web framework for building APIs and HTTP servers
- **MongoDB** — NoSQL database
- **Mongoose** — ODM for MongoDB (data modeling and validation)
- **swagger-jsdoc** — Generates OpenAPI documentation from code comments
- **swagger-ui-express** — Serves Swagger UI for interactive API docs
- **http-errors** — Simplified HTTP error handling
- **morgan** — HTTP request logger
- **cookie-parser** — Cookie parsing middleware
- **pug** — Template engine for server-side rendered views

---

## 3. ⚙️ Installation & Setup

### Requirements
- **Node.js**
- **MongoDB**

### Installation Steps

1. Extract the contents of the project archive
2. Install dependencies:
   ```npm install```
3. Start a local MongoDB instance on port 27017
4. Run the application:
    ```npm start```

## 4. 🌐 Application Access
App available at: http://localhost:3000

API Documentation: http://localhost:3000/api-docs

## 5. 🧠 Key Features & Implementation Notes

- JWT-based Authentication — Bearer token authentication via headers
- Auto-generated API Docs — Swagger docs created from JSDoc comments in routes/*.js
- Middleware Stack — Logging, error handling, and request parsing via Express middlewares
- Static File Serving — Images and assets served from public/images
- Global Error Handling — Unified error response system
- Modular Code Structure — Clean separation of logic for maintainability and scalability
