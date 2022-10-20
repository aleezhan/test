const db = require("../models");
const User = db.user;

exports.info = (req, res) => {
  User.findOne({_id: req.userId}).then((user) => {
      return res.status(200).send({
        email: user.id,
      });
  });
}
