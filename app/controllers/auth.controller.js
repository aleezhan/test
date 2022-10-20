const db = require("../models");
const config = require("../config/auth.config");
const { user: User, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  User.create({
    id: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }).then(() => res.send({ message: "User registered successfully!" }))
    .catch(err => res.status(500).send({ message: err.message }))
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      id: req.body.email
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.tokenExpiration
      });

      let refreshToken = await RefreshToken.createToken(user);

        res.status(200).send({
          email: user.id,
          accessToken: token,
          refreshToken: refreshToken,
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.tokenExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

exports.logout = (req, res) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No Authorized!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
        return res.status(401).send({ message: "No Authorized!" });
    }
    RefreshToken.destroy({
        where: {
            userId: decoded.id
        }
    }).then(() => {
            res.status(200).send({
              message: "Logout!"
            })
        })
    .catch(err => {
        res.status(400).send({
            message: err
        })
    })
  });
}
