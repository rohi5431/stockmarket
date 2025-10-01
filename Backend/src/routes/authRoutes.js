const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try{
    const existingUser = await User.findOne({ email });
    if(existingUser)
      return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, passwordHash });
    await user.save();

    res.status(201).json({ message: "User registered" });
  } 
  catch(err){
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await User.findOne({ email });
    if(!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if(!validPassword)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        following: user.following,
      },
    });
  } 
  catch(err){
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
