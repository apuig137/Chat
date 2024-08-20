import { Router } from "express";
import { login, logout, register } from "../controllers/user.controller.js";
import passport from "passport";

const router = Router()

router.post("/register",passport.authenticate("register"), register)
router.post("/login", passport.authenticate("login"), login)
router.get("/logout", logout)

export default router