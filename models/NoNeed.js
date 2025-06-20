import mongoose from "mongoose";

const collectorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    number: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    fixedAmount: {
        type: Number,
        default: 0
    },
    paidAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // adds createdAt and updatedAt
});

// Export the model
const Collector = mongoose.model("Collector", collectorSchema);
export default Collector;
