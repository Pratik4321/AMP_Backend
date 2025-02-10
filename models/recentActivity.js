const mongoose = require("mongoose");

const recentActivitySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    entity: {
        type: String,
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Instructur'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: Object,
    }
});

const RecentActivity = mongoose.model("RecentActivity", recentActivitySchema);

module.exports = RecentActivity;
