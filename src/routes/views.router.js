import { Router } from "express";

const router = Router()

export const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    if (req.session.user.role == "admin") return res.redirect('/admin');
    next();
}

export const adminAccess = (req, res, next) => {
    if (req.session.user.role !== "admin") return res.redirect('/');
    next()
}

router.get("/", privateAccess, async (req, res) => {
    const response = await fetch('http://localhost:8080/chat/getchat');
    const data = await response.json();
    res.render("index", {
        messages: data.payload
    })
})

router.get("/login", async (req, res) => {
    res.render("login")
})

router.get("/register", async (req, res) => {
    res.render("register")
})

router.get("/admin", adminAccess, async (req, res) => {
    const response = await fetch('http://localhost:8080/chat/getchat');
    const data = await response.json();
    res.render("admin", {
        name: req.session.user.name,
        messages: data.payload
    })
})

export default router