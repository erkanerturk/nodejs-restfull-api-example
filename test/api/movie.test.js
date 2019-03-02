const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const server = require("../../app");

chai.use(chaiHttp);

let movieId, token;

describe("api/movies tests", () => {
  before(done => {
    chai
      .request(server)
      .post("/authenticate")
      .send({
        username: "admin",
        password: "12345"
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe("/GET movies", () => {
    it("it should GET all the movies", done => {
      chai
        .request(server)
        .get("/api/movie")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("/POST movie", () => {
    it("it should POST a movie", done => {
      const movie = {
        title: "68Comedy",
        director_id: "5c72ebdecd8a1ced69f065f1",
        category: "Comedy",
        country: "Turkey",
        year: 1968,
        imdb_score: 9
      };

      chai
        .request(server)
        .post("/api/movie")
        .send(movie)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("director_id");
          res.body.should.have.property("category");
          res.body.should.have.property("country");
          res.body.should.have.property("year");
          res.body.should.have.property("imdb_score");
          movieId = res.body._id;
          done();
        });
    });
  });

  describe("/GET/:movie_id movie", () => {
    it("it should GET a movie by the given id", done => {
      chai
        .request(server)
        .get("/api/movie/" + movieId)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("director_id");
          res.body.should.have.property("category");
          res.body.should.have.property("country");
          res.body.should.have.property("year");
          res.body.should.have.property("imdb_score");
          res.body.should.have.property("_id").eql(movieId);
          done();
        });
    });
  });

  describe("/PUT/:movie_id movie", () => {
    it("it should PUT a given by id", done => {
      const movie = {
        title: "50Science",
        director_id: "5c72ebdecd8a1ced69f065f1",
        category: "Science",
        country: "Japon",
        year: 1950,
        imdb_score: 8
      };

      chai
        .request(server)
        .put("/api/movie/" + movieId)
        .send(movie)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title").eql(movie.title);
          res.body.should.have.property("director_id").eql(movie.director_id);
          res.body.should.have.property("category").eql(movie.category);
          res.body.should.have.property("country").eql(movie.country);
          res.body.should.have.property("year").eql(movie.year);
          res.body.should.have.property("imdb_score").eql(movie.imdb_score);
          done();
        });
    });
  });

  describe("/DELETE movie", () => {
    it("it should DELETE movie given by id", done => {
      chai
        .request(server)
        .delete("/api/movie/" + movieId)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("director_id");
          res.body.should.have.property("category");
          res.body.should.have.property("country");
          res.body.should.have.property("year");
          res.body.should.have.property("imdb_score");
          res.body.should.have.property("_id").eql(movieId);
          done();
        });
    });
  });
});
