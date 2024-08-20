import mongoose from "mongoose";

const messageCollection = "messages"

const messageSchema = new mongoose.Schema({
    content: String, 
    user: String,
})

export const messageModel = mongoose.model(messageCollection, messageSchema)