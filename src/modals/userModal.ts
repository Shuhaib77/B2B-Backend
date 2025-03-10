import mongoose from "mongoose";

const useSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["wholesailer", "retailer", "seller"],
    required: true,
  },
});
const User = mongoose.model("User", useSchema);

export default User;
