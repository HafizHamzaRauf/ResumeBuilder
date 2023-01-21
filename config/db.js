const mongoose = require("mongoose");
const DB_URI = require("./utils").DB_URI;

mongoose.set("strictQuery", true);
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("connected to database");
});

mongoose.connection.on("error", (err) => {
  console.log(`Error connecting to the database: ${err}`);
});
