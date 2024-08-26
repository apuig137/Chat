import express from "express"
import path from "path"
import __dirname from "./utils.js"
import displayRoutes from "express-routemap"
import { Server } from "socket.io"
import mongoose from "mongoose"
import handlebars from "express-handlebars"
import chatRouter from "./routes/chat.router.js"
import usersRouter from "./routes/users.router.js"
import viewsRouter from "./routes/views.router.js"
import dotenv from "dotenv"
import { messageModel } from "./models/message.model.js"
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import cors from "cors"
import compression from "compression"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080;
const MONGO = process.env.DB_URL

app.use(compression())

app.use(cors())

//app.use(cors({
//    origin: ["http://localhost:8080", "https://livechat-zk2w.onrender.com/login"],
//    methods: ["GET", "POST", "PUT", "DELETE"],
//    allowedHeaders: ["Content-Type", "Authorization"],
//    credentials: true
//}))

mongoose.connect(`mongodb+srv://apuig137:${process.env.DB_PSW}@cluster0.qgngvh8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl: 3600,
    }),
    secret: "CoderSecretSHHHHH",
    resave: false,
    saveUninitialized: false
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.use("/", viewsRouter)
app.use("/chat", chatRouter)
app.use("/user", usersRouter)

const httpServer = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    socket.on('chat', async (message, userName) => {
        const newMessage = new messageModel({ content: message, user: userName });
        await newMessage.save();
        const messageId = newMessage._id
        io.emit("chat", message, messageId)
    });

    socket.on('editMessage', async (messageId, newMessage) => {
        try {
            const message = await messageModel.findById(messageId);
            if (message) {
                message.content = newMessage;
                await message.save();
                io.emit('messageEdited', messageId, newMessage);
            }
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('deleteMessage', async (messageId) => {
        await messageModel.deleteOne({ _id: messageId });
        io.emit('messageDeleted', messageId);
    });
});
