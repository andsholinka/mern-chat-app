import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './backend/routes/auth.routes.js';
import messageRoutes from './backend/routes/message.routes.js';
import userRoutes from './backend/routes/user.routes.js';

import connectToDB from './backend/config/database.js';

const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)

app.listen(PORT, () => {
    connectToDB();
    console.log(`Server running on port ${PORT}`);
});