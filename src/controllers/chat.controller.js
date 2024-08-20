import { messageModel } from "../models/message.model.js";

export const getMessages = async (req, res) => {
    try {
        const messages = await messageModel.find()
        res.json({ status: "success", payload: messages })
    } catch (error) {
        res.status(400).json({ status: "error", message: "Error trying to get messages", payload: error });
    }
}

export const sendMessage = async (req, res) => {
    const { content } = req.body
    
    try {
        let message = await messageModel.create({
            content: content,
        })
        res.send({ status: "success" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "An error occurred while creating the message" });
    }
}

export const editMessage = async (req, res) => {
    const { newContent } = req.body

    try {
        let id = req.params.id;
        const message = await messageModel.findById(id);

        if (!message) {
            return res.status(404).json({ status: "error", message: "Message not found" });
        }

        message.content = newContent
        await message.save()

        res.status(200).json({ status: "success", message: "Menssage edited succesfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "An error occurred while editing a message" });
    }
}

export const deleteMessage = async (req, res) => {
    try {
        let id = req.params.id;
        const result = await messageModel.deleteOne({ _id: id });
        res.status(200).json({ status: "success", message: "Menssage deleted succesfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "An error occurred while deleting message" });
    }
}

export const deleteAllMesssages = async (req, res) => {
    try {
        await messageModel.deleteMany({})
        res.send({ status: "success", message: "All messages deleted" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "An error occurred while deleting messages" });
    }
}