const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect("mongodb://user1:abc123@ds139435.mlab.com:39435/movie-api", {
    // useMongoClient: true
    useNewUrlParser: true,
    useCreateIndex: true
  });

  mongoose.connection.on("open", () => {
    console.log("MongoDB: Connected");
  });

  mongoose.connection.on("error", err => {
    console.log("MongoDB Error: ", err);
  });
};
