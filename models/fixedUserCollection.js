import mongoose from "mongoose";

const fixedUserCollectionSchema = new mongoose.Schema({
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
    totalAmount: {
        type: String
    },
    submittedByFixedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FixedUser",
    },
    isApproved: { type: Boolean, default: false },
}, {
    timestamps: true // adds createdAt and updatedAt
});

// Export the model
const fixedUserCollection = mongoose.model("FixedUserCollection", fixedUserCollectionSchema);
export default fixedUserCollection;
