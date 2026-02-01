import express from "express";
import cors from "cors";

import usersRouter from "./routes/users.js";
import groupsRouter from "./routes/groups.js";
import tutorsRouter from "./routes/tutors.js";
import homeRouter from "./routes/home.js";
import notificationsRouter from "./routes/notifications.js";
import sessionRouter from "./routes/sessions.js";

import "./jobs/sessionCleanup.js";

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

const app = express();
/*
app.use(cors({
  origin: "https://study-mate-ynmd.onrender.com",
  credentials: true,
}));*/
app.use(cors());

// Allows Express to parse JSON data from incoming requests
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: false }));

// Define swagger options
const swaggerOptions = {
definition: {
openapi: "3.0.0",
info: {
title: "My API",
version: "1.0.0",
description: "API documentation for my project",
},
},
apis: ["./routes/*.js"], // Path to your API route files
};

// Generate swagger documentation
const swaggerDocs = swaggerJsdoc(swaggerOptions);
// Use app.use() to mount the Swagger UI to /api-docs:
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/users", usersRouter);
app.use("/groups", groupsRouter);
app.use("/tutors", tutorsRouter);
app.use("/home", homeRouter);
app.use("/notifications", notificationsRouter);
app.use("/sessions", sessionRouter);



// Initial route to test if your backend server is running properly
app.get("/", async (req, res) => {
res.send("<h1>Welcome to my API! The server is running successfully.</h1>");
});
// Set port
const PORT = process.env.PORT || 5050;
// Start server
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
