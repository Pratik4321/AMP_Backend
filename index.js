const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Instructur = require("./models/instructur.js");
const RecentActivity = require("./models/recentActivity.js");
const app = express();

app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "annasfurquan27@gmail.com",
        pass: "rpeu mugu ssel aram",
    },
});

// Function to send AMP emails
const sendAMPEmail = async (instructor, action) => {
    const ampHtml = `
        <!doctype html>
        <html ⚡4email>
        <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>
        </head>
        <body>
            <h1>Hello ${instructor.name}!</h1>
            <p>Your profile has been <b>${action}</b>.</p>

            <p>We'd love your feedback! Please fill out the form below:</p>

            <form method="post"
                action-xhr="https://your-api.com/submit-feedback"
                target="_top">
                <label for="feedback">Your Feedback:</label>
                <input type="text" name="feedback" id="feedback" required>
                <input type="hidden" name="email" value="${instructor.email}">
                
                <button type="submit">Submit</button>
                
                <div submit-success>
                    <template type="amp-mustache">
                        <p>Thank you! Your feedback has been received.</p>
                    </template>
                </div>
                <div submit-error>
                    <template type="amp-mustache">
                        <p>Oops! Something went wrong. Please try again.</p>
                    </template>
                </div>
            </form>
        </body>
        </html>
    `;

    const mailOptions = {
        from: `"Admin" <${process.env.EMAIL_USER}>`,
        to: instructor.email,
        subject: `Your Profile Has Been ${action}`,
        text: `Hello ${instructor.name}, Your profile has been ${action}. Please provide feedback.`,
        html: ampHtml,
        amp: ampHtml,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        await RecentActivity.create({
            action: `Sent email with feedback form: ${action}`,
            entity: "Instructur",
            entityId: instructor._id,
            metadata: { emailResponse: info.response },
        });

        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Email failed:", error);
        await RecentActivity.create({
            action: "Failed to send AMP email",
            entity: "Instructur",
            entityId: instructor._id,
            metadata: { error: error.message },
        });
    }
};


// Create an instructor and send an email
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

// Update instructor and send an email
app.put("/instructurs/:id", async (req, res) => {
    try {
        const instructur = await Instructur.findByIdAndUpdate(req.params.id, req.body, { new: true });

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
        const activities = await RecentActivity.find().sort({ timestamp: -1 }).limit(10);
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://annasfurquan:Fsrxq13jTKVK8GXk@bac.6perr.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Bac")
    .then(() => {
        console.log("Connected to the database");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((error) => {
        console.log("Connection failed!!!", error);
    });
