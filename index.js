const express = require("express");
const mongoose = require("mongoose");
const Instructur = require("./models/instructur.js");
const RecentActivity = require("./models/recentActivity.js");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send('Hello server!!!');
});

app.post("/instructurs", async (req, res) => {
    try {
        const i = await Instructur.create(req.body);
        res.status(200).json(i);

        const activity = new RecentActivity({
            action: "Created new instructur",
            entity: "Instructur",
            entityId: i._id
        });
        await activity.save();

        console.log(i);
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
            activity = new RecentActivity({
                action: "Updated instructur",
                entity: "Instructur",
                entityId: instructur._id
            });
            await activity.save();
        }

        res.status(200).json(instructur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/recent-activity", async (req, res) => {
    try {
        const activities = await RecentActivity.find().sort({ timestamp: -1 }).limit(10);
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
