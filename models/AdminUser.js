import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema({
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
    password: { type: String },
    address: { type: String, },
    token: { type: String }
}, {
    timestamps: true // adds createdAt and updatedAt
});

// Export the model
const AdminUser = mongoose.model("AdminUser", adminUserSchema);
export default AdminUser;
