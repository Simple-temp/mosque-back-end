import mongoose from "mongoose";

const fixedUserSchema = new mongoose.Schema({
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
    address: {
        type: String,
    },
    password :{ type: String },
    role : { type:String },
    token: { type: String }
}, {
    timestamps: true // adds createdAt and updatedAt
});

// Export the model
const FixedUser = mongoose.model("FixedUser", fixedUserSchema);
export default FixedUser;
