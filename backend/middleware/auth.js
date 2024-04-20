import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const auth = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                status: res.statusCode,
                message: "Unauthorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                status: res.statusCode,
                message: "Unauthorized - Invalid token"
            })
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({
                status: res.statusCode,
                message: "User not found"
            })
        }

        req.user = user
        next();

    } catch (error) {
        res.status(500).json({
            status: res.statusCode,
            message: "Internal server error"
        })
    }
}

export default auth