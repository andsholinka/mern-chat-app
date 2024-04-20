import User from "../models/user.model.js"

export const getUsersForSidebar = async (req, res) => {
    try {

        const loggedInUserId = req.user.id

        const allUsers = await User.find({
            _id: {
                $ne: loggedInUserId
            }
        }).select("-password");

        res.status(200).json({
            status: res.statusCode,
            message: "Users fetched successfully",
            data: allUsers
        })
    } catch (error) {
        res.status(500).json({
            status: res.statusCode,
            message: "Internal server error"
        })
    }
}