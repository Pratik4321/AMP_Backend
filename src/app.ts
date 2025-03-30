import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { instructorRoute } from "./routes/instructor.routes";
import { emailRoute } from "./routes/email.routes";
import { emailTrackRoute } from "./routes/email-track.route";
import { recentActivitiesRoute } from "./routes/recent-activity.route";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
  })
);

app.use(cookieParser());

// Middleware to parse JSON
app.use(
  express.json({
    limit: "10mb",
  })
);

//routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/instructors", instructorRoute);

app.use("/send-batch-emails", emailRoute);

app.use("/email-tracking", emailTrackRoute);

app.use("/recent-activities", recentActivitiesRoute);

app.use("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "not found",
  });
});
export default app;
