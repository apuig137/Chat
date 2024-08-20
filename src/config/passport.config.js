import passport from "passport";
import local from "passport-local"
import userModel from "../models/user.model.js";
import {createHash,isValidPassword} from "../utils.js"

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        usernameField: 'name',
        passReqToCallback: true,
    }, async (req, name, password, done) => {
        try {
            let user = await userModel.findOne({ name: name });
            if (user) return done(null, false);
            
            const newUser = new userModel({
                name,
                password: createHash(password),
                role: "user",
                last_connection: new Date()
            });

            user = await userModel.create(newUser);
            await newUser.save();

            return done(null, user);
        } catch (error) {
            return done(error, false, { message: "Error creating user" });
        }
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'name' }, async (name, password, done) => {
        try {
            const user = await userModel.findOne({ name: name });
            if (!user) {
                console.log("User not found");
                return done(null, false, { message: "User not found" });
            }
            if (!isValidPassword(password, user.password)) {
                console.log("Invalid credentials");
                return done(null, false, { message: "Invalid credentials" });
            }
            return done(null, user);
        } catch (error) {
            console.error("Error logging in:", error);
            return done({ message: "Error logging in" });
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await userModel.findOne({ _id });
            return done(null, user);
        } catch {
            return done({ message: "Error deserializing user" });
        }
    });
};

export default initializePassport;