const router = require("express").Router();
const User = require("../models/userModel")
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth")
const jwt = require('jsonwebtoken')
require("dotenv").config();

router.post("/register", async(req, res) => {
    try {
        let { email, password, passwordCheck } = req.body
        console.log(email)
        console.log(password)
        console.log(passwordCheck)

        if (!email || !password || !passwordCheck)
            return res.status(400).json({ msg: "Not all fields have been entered" });
        if (password.length < 5)
            return res.status(400).json({ msg: "The pasword needs to be 5 character long" })
        if (password !== passwordCheck)
            return res.status(400).json({ msg: "Enter the same password " })

        const existingUser = await User.findOne({ email: email })

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);


        console.log(passwordHash)
        if (existingUser) {
            return res.status(400).json({ msg: "email already exist" })
        }
        if (!displayName)
            displayName = email;
        const newUser = new User({
            email,
            password: passwordHash,
            displayName,
        });

        const saveUser = await newUser.save();
        res.json(saveUser)
    } catch (err) {

        res.status(500).json({ error: err.message });
    }

});

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ msg: "Not all fields have been " });

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: "No account with this email id has been registeres" })
        }
        console.log(password)
        console.log(user.password)
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("hello", isMatch)
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credential" })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.messages });
    }
})

router.delete("/delete", auth, async(req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.user);
        res.json(deleteUser);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})



module.exports = router;