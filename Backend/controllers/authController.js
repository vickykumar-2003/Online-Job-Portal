import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {

    try{
        const {name, email, password, role} = req.body;

        //Check required fields

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        //Check existing user

        const existingUser = await User.findOne({ email});

        if (existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        //Hash password
const hashedPassword = await bcrypt.hash(password, 10);

        //Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "jobSeeker",
        });

        res.status(201).json({
            success: true,
            message: "User registerd successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error){
        console.log("Register error:", error.message);

        res.status(500).json({
            success:false,
            message: "Server error",
        });
    };
}


export const loginUser = async (req, res) =>{
    try{
        const { email, password} = req.body;

        //Check required fields
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        //Check password
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        //Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );


        res.status(200).json({
            success:true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
    catch (error){
        console.log("Login errror:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    };
}