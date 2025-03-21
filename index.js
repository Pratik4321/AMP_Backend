const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Instructur = require("./models/instructur.js");
const RecentActivity = require("./models/recentActivity.js");
const cors = require("cors");
const FormData = require("./models/form.js");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://mail.google.com"); // Allow Gmail
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "annasfurquan27@gmail.com",
    pass: "rpeu mugu ssel aram",
  },
});

// Function to send AMP emails
const sendBatchAMPEmails = async (instructors, course) => {
  const emailPromises = instructors.map(async (instructor) => {
    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? "Good Morning"
        : hour < 18
        ? "Good Afternoon"
        : "Good Evening";

    const ampHtml = `
<!doctype html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <style amp4email-boilerplate>body{visibility:hidden}</style>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background: #f4f4f7;
      color: #333;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: left;
    }
    h1 {
      color: #333;
      font-size: 22px;
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      margin-bottom: 15px;
    }
    .course-box {
      background: #f9fafb;
      padding: 15px;
      border-left: 4px solid #4f46e5;
      border-radius: 6px;
      font-size: 15px;
      color: #333;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      font-size: 16px;
      font-weight: 600;
      display: block;
      margin-bottom: 10px;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .radio-group label {
      display: flex;
      align-items: center;
      background: #f3f4f6;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
      width: 100%;
      justify-content: center;
    }
    .radio-group input[type="radio"] {
      display: none;
    }
    .radio-group input[type="radio"]:checked + label {
      background: #4f46e5;
      color: #fff;
    }
    .button {
      display: block;
      width: 100%;
      padding: 12px;
      font-size: 16px;
      color: #fff;
      background-color: #4f46e5;
      border-radius: 6px;
      text-align: center;
      font-weight: 600;
      transition: 0.3s;
      border: none;
    }
    .button:hover {
      background-color: #4338ca;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${greeting}, ${instructor.name}!</h1>
    <p>We have a new course available for you:</p>

    <div class="course-box">
      <strong>${course.name}</strong><br>
      ${course.description}
    </div>

    <p>Would you be available to teach this course?</p>
   
     <a href="http://localhost:3001/form?email=${instructor.email}&course=${course.name}&avialability=''&name=${instructor.name}&instructorId=${instructor.id}" target="_blank">
    <button style="padding: 10px 20px; background-color: green; color: white; border: none; border-radius: 5px;">Confirm in our Website</button>
  </a>

    <p class="footer">If you have any questions, feel free to reach out.</p>
  </div>
</body>
</html>



    `;

    const mailOptions = {
      from: "Admin <annasfurquan27@gmail.com>",
      to: instructor.email,
      subject: `Availability Request for ${course.name}`,
      html: ampHtml,
      amp: ampHtml,
    };

    try {
      await transporter.sendMail(mailOptions);
      await RecentActivity.create({
        action: `Sent availability request for ${course.name}`,
        entity: "Instructor",
        entityId: instructor._id,
      });
    } catch (error) {
      console.error(`Email failed to ${instructor.email}:`, error);
    }
  });

  await Promise.all(emailPromises);
  
};

// API to send batch emails
app.post("/send-batch-emails", async (req, res) => {
  try {
    const instructors = await Instructur.find();
    if (instructors.length === 0)
      return res.status(404).json({ message: "No instructors found" });

    await sendBatchAMPEmails(instructors, {
      name: "CSE",
      description: "This is a great course",
    });
    res.status(200).json({ message: "Batch emails sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API to record instructor availability response
app.post("/submit-availability", async (req, res) => {
  try {
    const { email, course, availability, name, instructorId } = req.body;
    if (!email || !course || !availability) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const formData = new FormData({
      email: email,
      availability: availability,
      instructorName: name,
      instructorId: instructorId,
    });
    await formData.save();
    res.send("Form Submission successfull");

    await RecentActivity.create({
      action: "Instructor Availability Response",
      entity: "Instructor",
      metadata: { email, course, availability },
    });

    res.json({ message: "Availability submitted successfully!" });
  } catch (error) {
    console.error("Error submitting availability:", error);
    res.status(500).json({ message: "Error submitting availability" });
  }
});

app.post("/instructurs", async (req, res) => {
  try {
    const i = await Instructur.create(req.body);
    res.status(200).json(i);

    await RecentActivity.create({
      action: "Created new instructur",
      entity: "Instructur",
      entityId: i._id,
    });

    sendAMPEmail(i, "Created");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

app.get("/instructurs", async (req, res) => {
  try {
    const instructurs = await Instructur.find();
    res.status(200).json(instructurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update instructor and send an email
app.put("/instructurs/:id", async (req, res) => {
  try {
    const instructur = await Instructur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!instructur) {
      return res.status(404).json({ message: "Instructur not found" });
    }

    let activity = await RecentActivity.findOne({ entityId: instructur._id });

    if (activity) {
      activity.action = "Updated instructur";
      activity.timestamp = Date.now();
      await activity.save();
    } else {
      await RecentActivity.create({
        action: "Updated instructur",
        entity: "Instructur",
        entityId: instructur._id,
      });
    }

    sendAMPEmail(instructur, "Updated");

    res.status(200).json(instructur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent activities
app.get("/recent-activity", async (req, res) => {
  try {
    const activities = await RecentActivity.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Automated Follow-Up System
const sendFollowUpEmails = async () => {
  const pendingResponses = await RecentActivity.find({
    action: "Sent availability request for CSE",
  });
  const respondedEmails = new Set(
    (
      await RecentActivity.find({ action: "Instructor Availability Response" })
    ).map((r) => r.metadata.email)
  );
  const followUpInstructors = pendingResponses.filter(
    (p) =>
      p.metadata && p.metadata.email && !respondedEmails.has(p.metadata.email)
  );

  if (followUpInstructors.length > 0) {
    console.log("Sending follow-up emails...");
    await sendBatchAMPEmails(
      followUpInstructors.map((i) => ({
        email: i.metadata.email,
        name: "Instructor",
      })),
      { name: "CSE", description: "Follow-up: Please respond" }
    );
  }
};

setInterval(sendFollowUpEmails, 10 * 1000); // Runs every 24 hours

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://annasfurquan:Fsrxq13jTKVK8GXk@bac.6perr.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Bac"
  )
  .then(() => {
    console.log("Connected to the database");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("Connection failed!!!", error);
  });
