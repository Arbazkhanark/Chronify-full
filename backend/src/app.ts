import express from "express";
import routes from "./routes";
import { logger,httpLogger } from 'patal-log'
import cors from "cors"

export const app = express();



logger.init({
    mode: 'pro',
    logLevel: 'info',
    filePath: './logs/app.log'
});



// Use HTTP middleware
app.use(express.json());
app.use(httpLogger());

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Update with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));






app.get("/", (req, res) => {
  res.json({ message: "Welcome to the StudyWay API!" });
});

app.use("/v0/api", routes);
// app.use("/v0/api", (req, res, next) => {
//   console.log('Routes loaded');
//   next();
// }, routes);

// Test route - pehle isse check karo
app.get("/v0/api/test", (req, res) => {
  console.log("✅ Test route hit!");
  res.json({ 
    success: true, 
    message: "Route is working!",
    timestamp: new Date().toISOString()
  });
});






