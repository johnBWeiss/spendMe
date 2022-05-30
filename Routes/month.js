const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const OneSpend = require('../Models/oneSpend')
const monthModel = require('../Models/month')

const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const jwt = require('jsonwebtoken')


const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send(err.message);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

router.get("/detailsByMonth/:year/:month/:id",
    authJWT,
    async (req, res) => {
        try {
            const month = await monthModel.find(
                {
                    month: Number(req.params.month),//TODO i might not need the Number
                    createdBy: (req.params.id),
                    year: Number(req.params.year)//TODO i might not need the Number
                },
            )
            // populates entire list 
            // for (v of month) {
            //     await v.populate('createdBy')
            // }
            console.log(month);
            res.send(month)
        } catch (error) {
            res.status('500').send(error.message)
        }
    })



router.get("/amountByMonth/:year/:month/:id",
    authJWT,
    async (req, res) => {

        try {
            const month = await OneSpend.aggregate(
                [{
                    $match: {
                        createdBy: ObjectId('628ca3189c2617df6b5603af'),
                        month: Number(req.params.month),
                        year: Number(req.params.year)//TODO i might not need the Number

                    }
                },
                {
                    $group: { _id: { month: "$month" }, total: { $sum: "$amount" } },// thsum amount by month
                },
                ]
            )
            console.log(month);
            res.send(month)
        } catch (error) {
            res.status('500').send(error.message)
        }
    })


router.get("/detailsByYear/:year/:id",
    authJWT,
    async (req, res) => {

        try {
            const year = await OneSpend.find(
                {
                    createdBy: (req.params.id),
                    year: Number(req.params.year)//TODO i might not need the Number
                },
            )
            // populates entire list 
            // for (v of month) {
            //     await v.populate('createdBy')
            // }
            res.send(year)
        } catch (error) {
            res.status('500').send(error.message)
        }
    })



router.get("/amountByYear/:year/:id",
    authJWT,
    async (req, res) => {

        try {
            const year = await OneSpend.aggregate(
                [{
                    $match: {
                        createdBy: ObjectId('628ca3189c2617df6b5603af'),
                        year: Number(req.params.year)//TODO i might not need the Number

                    }
                },
                {
                    $group: { _id: { year: "$year" }, total: { $sum: "$amount" } },// thsum amount by month
                },
                ]
            )
            res.send(year)
        } catch (error) {
            res.status('500').send(error.message)
        }
    })

//POST

//TODO
//when i add caegory, do not open a new one. check if exists category and if month and year matches. if it does, i update the amount and add the current amount with the amount already stored.
//if in the future i want detailed for every single urchase, probably better to have a seprate list of detailed purchases so the speed of getting the sum of each category stays fast

router.get("/:id", async (req, res) => {

    try {

        if (req.params.id) {

            // const oneSpend = await OneSpend.aggregate(
            //     [{ $match: { createdBy: ObjectId('628ca3189c2617df6b5603af') } },

            //     ]
            // )
            // user[0].populate('createdBy')

            const oneSpend = await OneSpend.find(
                { createdBy: '628ca3189c2617df6b5603af' } ,


            )

            // user.populate('createdBy')
            const pop = await oneSpend[0].populate('createdBy')
            console.log(pop);


            res.send(oneSpend);
        }

        // let users = await User.find();
        // console.log(users);
        // res.send(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }

});

// http://localhost:5000/oneSpend/item/2022/5/62932ec5c92748aa8c970eca/food/22



router.post("/item/:year/:month/:id/:category/:amount", authJWT, async (req, res) => {

    try {

        const checkCategory = await monthModel.findOneAndUpdate({
            month: Number(req.params.month),//TODO i might not need the Number
            createdBy: (req.params.id),
            year: Number(req.params.year),
            category: (req.params.category)
        }, {
            $inc: { amount: req.params.amount }
        })


        if (!checkCategory) {
            const newSpend = await new monthModel({ ...req.body }).save();
            console.log(newSpend);
        }

        try {
            const month = await monthModel.find(
                {
                    month: Number(req.params.month),//TODO i might not need the Number
                    createdBy: (req.params.id),
                    year: Number(req.params.year)//TODO i might not need the Number
                },
            )
            console.log(month);
            res.send(month)
        } catch {
            res.status(500).send(error.message)

        }


        // res.send();
        //i want to send the artay of monthly buys from here so it will be updated in the ui
        //without sending a sperate api request
    } catch (error) {
        res.status('500').send(error.message)
    }

}

)



module.exports = router

