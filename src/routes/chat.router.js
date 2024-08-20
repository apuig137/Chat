import { Router } from "express";
import { deleteAllMesssages, deleteMessage, editMessage, getMessages, sendMessage } from "../controllers/chat.controller.js";

const router = Router()

router.get("/getchat", getMessages)
router.post("/sendmessage", sendMessage)
router.put("/editmessage/:id", editMessage)
router.delete("/deletemessage/:id", deleteMessage)
router.delete("/deleteall", deleteAllMesssages)

export default router