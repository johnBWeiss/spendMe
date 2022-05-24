const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const OneSpend = require('../Models/oneSpend')

router.get("/amountByMonth/:month", async (req, res) => {

    try {
        const month = await OneSpend.aggregate(
            [{ $match: { month: Number(req.params.month) } },
            {
                $group: { _id: { month: "$month" }, total: { $sum: "$amount" } },// thsum amount by month
            },
            ]
        )
        res.send(month)
    } catch (error) {
        res.status('500').send(error.message)
    }
})

router.get("/monthDetails/:month", async (req, res) => {

    try {
        const monthDetails = await OneSpend.aggregate(
            [{ $match: { month: Number(req.params.month) } },

            ]
        )
        res.send(monthDetails)

    } catch (error) {
        res.status('500').send(error.message)
    }
})

router.get("/allMonths", async (req, res) => {

    try {
        const allMonths = await OneSpend.aggregate(
            [
                {
                    $group: { _id: { month: "$month" }, total: { $sum: "$amount" } },
                },
            ]
        )
        res.send(allMonths)

    } catch (error) {
        res.status('500').send(error.message)
    }


})

router.get("/yearTotal", async (req, res) => {


    try {
        const year = await OneSpend.aggregate(
            [
                {
                    $group: { _id: { year: "$year" }, total: { $sum: "$amount" } },
                },
            ]
        )
        res.send(year)
    } catch (error) {
        res.status('500').send(error.message)
    }



})

router.get("/yearDetails/:year", async (req, res) => {

    try {
        const yearDetails = await OneSpend.aggregate(
            [{ $match: { year: Number(req.params.year) } },
            ]
        )
        res.send(yearDetails)
    } catch (error) {
        res.status('500').send(error.message)
    }

})

router.post("/", async (req, res) => {
    try {
        const newSpend = await new OneSpend({ ...req.body }).save();
        res.send(newSpend);
    } catch (error) {
        res.status('500').send(error.message)
    }

}

)

module.exports = router

