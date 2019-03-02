const express = require("express");
const router = express.Router();

// Models
const Movie = require("../models/Movie");

router.get("/", (req, res, next) => {
  Movie.aggregate([
    {
      $lookup: {
        from: "directors",
        localField: "director_id",
        foreignField: "_id",
        as: "director"
      }
    },
    {
      $unwind: "$directors"
    }
  ])
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

router.get("/top10", (req, res, next) => {
  Movie.find({})
    .sort({ imdb_score: -1 })
    .limit(2)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

router.get("/:movie_id", (req, res, next) => {
  Movie.findById(req.params.movie_id)
    .then(data => {
      if (!data) return next({ message: "The movie was not found", code: 1 });

      res.json(data);
    })
    .catch(err => res.json(err));
});

router.get("/between/:start_year/:end_year", (req, res, next) => {
  const { start_year, end_year } = req.params;

  Movie.find({
    year: {
      $gte: parseInt(start_year),
      $lte: parseInt(end_year)
    }
  })
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

router.put("/:movie_id", (req, res, next) => {
  Movie.findByIdAndUpdate(req.params.movie_id, req.body, {
    // Güncellenmiş veri geri dönürür
    new: true
  })
    .then(data => {
      if (!data) return next({ message: "The movie was not found", code: 1 });

      res.json(data);
    })
    .catch(err => res.json(err));
});

router.delete("/:movie_id", (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movie_id)
    .then(data => {
      if (!data) return next({ message: "The movie was not found", code: 1 });

      res.json(data);
    })
    .catch(err => res.json(err));
});

router.post("/", (req, res, next) => {
  const movie = new Movie({
    ...({ title, imdb_score, category, country, year } = req.body)
  });

  movie.save((err, data) => {
    err ? res.status(406).json(err) : res.json(data);
  });
});

module.exports = router;
