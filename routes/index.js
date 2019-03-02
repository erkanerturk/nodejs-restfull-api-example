const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Models
const User = require("../models/User");

router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  bcryptjs.hash(password, 10).then(hash => {
    new User({
      username,
      password: hash
    })
      .save()
      .then(data => res.json(data))
      .catch(err => res.json(err));
  });
});

router.post("/authenticate", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) throw err;

    if (!user) {
      return res.json({
        status: false,
        message: "Authentication failed, user not found"
      });
    }

    bcryptjs.compare(password, user.password).then(result => {
      if (!result) {
        return res.json({
          status: false,
          message: "Wrong password"
        });
      }

      const payload = {
        username
      };

      const token = jwt.sign(payload, req.app.get("api_secret_key"), {
        expiresIn: 720
      });

      return res.json({
        status: true,
        token
      });
    });
  });
});

module.exports = router;
