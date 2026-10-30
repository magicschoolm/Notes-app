const db = require("../config/db");
require("dotenv").config();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
    try {
        const { username, password, email, contact } = req.body
        const profile_image = req.file? `/uploads/${req.file.filename}`:null
        if (!username || !email || !password ) {
            return res.status(400).json({
                message: "username, email, and password are required"
            })
        }

        //checking if the user already exist or not ?

        const [existinguser] = await db.query (
            "SELECT * FROM users WHERE username=? OR email=?", [username, email])
            if (existinguser.length > 0) {
                return res.status(400).json({
                    message: "username or email already exists" })
                }

        // hashing password
        const hashedpassward = await bcrypt.hash(password, 10)    
        
        //store user data to DB
        const  sql="INSERT INTO users (username, email, contact, password, profile_image) VALUES (?,?,?,?,?)"
        await db.query(sql, [username, email, contact || null, hashedpassward, profile_image])
        res.status(201).json({
            message: "User register Successfully.!"
        })
    }
        catch ( error ) {
            console.error("Registration failed:", error)
            res.status(500).json({
                message: "server Error",
                error: error.message || error.code || error.name || "Unknown error"
            })
        }
    }

    
   
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check whether username and password were provided
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // Find user by username OR email
        const [users] = await db.query(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, username]
        );

        // Check whether the user exists
        if (users.length === 0) {
            return res.status(400).json({
                message: "Username or email does not exist"
            });
        }

        const user = users[0];

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        // generate token 
        const token = jwt.sign ({ id: user.id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES})
        
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(
            Date.now() + Number(process.env.COOKIES_EXPIRES || 1) * 24 * 60 * 60 * 1000
    )
});
        // Successful login
        return res.status(200).json({
            message: "Login successful"
        });

    } catch (error) {
        console.error("Login failed:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

    const getCurrentUser = async (req, res ) => {
        try {
        const user_id = req.user.id
        const [users] = await db.query("SELECT id, username, email, contact, profile_image from users WHeRE id=?", [user_id])
        if (users.length === 0) {
            return res.ststus(404).json({
                message: "user not found"
            })
        }
        res.json(users[0])
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error.message
        })
    }
    }



    const uploadProfileImage = async (req, res) => {
        try {
        const user_id = req.user.id
        const profile_image = req.file ? `/uploads/${req.file.filename}` : null
        const [result] = await db.query("UPDATE users SET profile_image =? WHERE id=?", [profile_image, user_id])
        if (result.affectedRows === 0) {
            return res.ststus(404).json({
                message: "user not found"
            })
        }
        res.json({ message: "profile image uploaded", profile_image})
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error.message
        })
    }
    }

    const logout = (req, res)  => {
        try {
            res.clearCookie("token")
            res.json({
                message: "logout successful" })
            } catch (error) {
                res.status(500).json({
                    message: "server error", error: error.message
                })
        }
    }

    
module.exports = { register, login, getCurrentUser, uploadProfileImage, logout }