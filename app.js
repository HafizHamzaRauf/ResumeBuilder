const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./Controllers/error");
require("./config/db");
const authRoutes = require("./routes/auth");
const app = express();

// *************   REQUEST  PARSING MIDDLEWARE ****************//
app.use(cors());
app.use(bodyParser.json());

//**************    MAIN MIDDLEWARES **********************/
app.use("/auth", authRoutes);

// **************   ERROR HANDLING MIDDLEWARE ************//
app.use(errorHandler);

// Listen on enviroment variable PORT or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
