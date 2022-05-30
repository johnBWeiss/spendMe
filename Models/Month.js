const mongoose = require('mongoose')
const { stringify } = require('nodemon/lib/utils')
const monthSchema = new mongoose.Schema({

    amount: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },

    category: { type: String, required: true }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("MonthSummary", monthSchema)

