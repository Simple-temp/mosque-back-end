import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, },
  address: String,
  number: { type: String, },
  amount: Number,
  email: { type: String, },
  fixedAmount: Number,
  role: String,
  paidAmount: Number,
  userType: { type: String },
  isDeleted: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },

  // 🔽 Add these two fields
  submittedByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
  },
  submittedByFixedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FixedUser",
  },
});

const Collection = mongoose.model("Collection", userSchema);
export default Collection;

