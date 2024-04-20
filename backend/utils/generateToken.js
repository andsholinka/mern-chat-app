import jwt from "jsonwebtoken";

const generateToken = (id, res) => {
    const token = jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })

    res.cookie("token", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevents XSS attack cross-site scripting attacks
        sameSite: "strict", // prevents CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV === "development"
    })
}

export default generateToken