import userModel from "../models/user.model.js";

export const login = async (req, res) => {
    try {
        const userName = req.user.name;
        const user = await userModel.findOne({ name: userName });
        user.last_connection = new Date();
        await user.save();

        if (!req.user) return res.status(400).send({ status: "error", error: "Incorrect credentials" });
        
        res.cookie('username', req.user.name, {
            maxAge: 3600000, // 1 hora en milisegundos
            httpOnly: false, // Permitir el acceso a la cookie mediante JavaScript
            secure: process.env.NODE_ENV === 'production', // Usar solo HTTPS en producción
        });

        req.session.user = {
            name: req.user.name,
            role: req.user.role
        }
        res.send({ status: "success", payload: req.session.user, message: "Logueo realizado" });
    } catch (error) {
        console.log(error)
    }
}

export const register = async (req, res) => {
    res.send({ status: "success", message: "User registered" });
}

export const logout = async (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error destroying session' });
            }
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    });
}