import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

let refreshTokens = []; 

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    refreshTokens.push(refreshToken);

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  refreshTokens.push(refreshToken);

  res.json({
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const refresh = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "No token" });
  if (!refreshTokens.includes(refreshToken))
    return res.status(403).json({ message: "Invalid refresh token" });

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    (err, decodedUser) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      const newAccessToken = generateAccessToken(decodedUser);
      res.json({ accessToken: newAccessToken });
    }
  );
};

export const logout = (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== refreshToken);
  res.json({ message: "Logged out" });
};