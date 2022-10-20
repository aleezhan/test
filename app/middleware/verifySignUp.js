const db = require("../models")
const User = db.user

module.exports = checkDuplicateEmail = (req, res, next) => {
    User.findOne({
        where: {
            id: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Email is already in use!"
            })
            return
        }

        next()
    })
}
