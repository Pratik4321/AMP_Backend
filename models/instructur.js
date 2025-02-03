const mongoose = require('mongoose')

const instructurSchema = mongoose.Schema(
    {
        name: {
            type : String,
        },

        status: {
            type : String
        }
    }, { timestamps: true }
)

const Instructur = mongoose.model("Instructor", instructurSchema)

module.exports = Instructur;