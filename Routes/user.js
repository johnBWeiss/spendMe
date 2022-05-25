const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId;


router.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userAlreadyExists = await User.findOne({ username: req.body.username });
        if (userAlreadyExists) {
            res.status(401).send('user already exists')
        }

        const newUser = await new User({
            username: req.body.username,
            password: hashedPassword,
        }).save()
        console.log(newUser);
        res.json(newUser)


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }

}

)


router.post('/login', async (req, res) => {

    try {

        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        const passwordMatches = await bcrypt.compare(req.body.password, user.password)
        if (passwordMatches) {
            console.log(user);
            const accessToken = jwt.sign((user).toJSON(), process.env.TOKEN_SECRET, { expiresIn: '30m' })
            console.log(accessToken);
            res.json(accessToken)
        }
        else {
            res.status(400).json({ message: "Invalid credentials" });

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }


})

router.get("/:id", async (req, res) => {

    try {

        if (req.params.id) {

            const user = await User.aggregate(
                [{ $match: { _id: ObjectId('628ca3189c2617df6b5603af') } },

                ]
            )
            console.log(user);
            res.send(user);
        }

        let users = await User.find();
        console.log(users);
        // res.send(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }

});

module.exports = router