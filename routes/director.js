const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Director = require("../models/Director");

router.get("/", (req, res) => {
  Director.aggregate([
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          name: "$name",
          surname: "$surname",
          bio: "$bio"
        },
        movies: {
          $push: "$movies"
        }
      }
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        surname: "$_id.surname",
        bio: "$_id.bio",
        movies: "$movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true
      }
    }
  ])
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

router.get("/:director_id", (req, res, next) => {
  Director.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.director_id)
      }
    },
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          name: "$name",
          surname: "$surname",
          bio: "$bio"
        },
        movies: {
          $push: "$movies"
        }
      }
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        surname: "$_id.surname",
        bio: "$_id.bio",
        movies: "$movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true
      }
    }
  ])
    .then(data => {
      if (!data)
        return next({ message: "The director was not found", code: 1 });

      res.json(data);
    })
    .catch(err => res.json(err));
});

router.put("/:director_id", (req, res, next) => {
  Director.findByIdAndUpdate(req.params.director_id, req.body, {
    new: true
  })
    .then(data => {
      if (!data)
        return next({ message: "The director was not found", code: 1 });

      res.json(data);
    })
    .catch(err => res.json(err));
});

router.delete("/:director_id", (req, res, next) => {
  Director.findByIdAndRemove(req.params.director_id)
    .then(data => {
      if (!data)
        return next({ message: "The director was not found", code: 1 });

      res.json(data);
    })
    .catch(err => res.json(err));
});

router.post("/", (req, res) => {
  new Director({ ...req.body })
    .save()
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

module.exports = router;
