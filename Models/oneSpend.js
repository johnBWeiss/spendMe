const mongoose = require('mongoose')
const { stringify } = require('nodemon/lib/utils')
const spendOneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        // required: true
    },

    category: { type: String, required: true }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("SpendOne", spendOneSchema)

