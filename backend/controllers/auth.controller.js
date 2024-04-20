import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            confirmPassword,
            gender
        } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: res.statusCode,
                message: "Passwords do not match"
            });
        }

        const existingUser = await User.findOne({
            email
        })

        if (existingUser) {
            return res.status(400).json({
                status: res.statusCode,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            gender,
            profilePicture: gender === "male" ? boyProfilePicture : girlProfilePicture
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser.id, res);
            await newUser.save();

            res.status(201).json({
                status: res.statusCode,
                message: "User created successfully",
                data: {
                    id: newUser.id,
                    username: newUser.username,
                    profilePicture: newUser.profilePicture
                }
            })
        } else {
            res.status(400).json({
                status: res.statusCode,
                message: "Invalid user data"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: res.statusCode,
            message: "Internal server error"
        })
    }
};

export const login = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        const user = await User.findOne({
            username
        })

        const isPasswordCorrect = await bcrypt.compare(password, user && user.password || "");;

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({
                status: res.statusCode,
                message: "Invalid username or password"
            });
        }

        generateTokenAndSetCookie(user.id, res);

        res.status(200).json({
            status: res.statusCode,
            message: "Login successful",
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        })

    } catch (error) {
        res.status(500).json({
            status: res.statusCode,
            message: "Internal server error"
        })
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            maxAge: 0
        })

        res.status(200).json({
            status: res.statusCode,
            message: "Logout successful"
        })
    } catch (error) {
        res.status(500).json({
            status: res.statusCode,
            message: "Internal server error"
        })
    }
};