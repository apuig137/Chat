import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    role: String,
    last_connection: Date,
})

const userModel = mongoose.model(userCollection,userSchema);

export default userModel;
