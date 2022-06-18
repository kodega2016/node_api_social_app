const express = require("express");
const fs = require("fs");
const app = express();
require("colors");

//use body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//load environment variables
require("dotenv").config({ path: "./config/.env" });

//connect to database
const connectDB = require("./db/connectDB");
connectDB();

//load database models
require("./models/post");
require("./models/user");

//setup express-fileupload
const fileUpload = require("express-fileupload");
app.use(fileUpload());

//setup static files
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//morgan for logger
const morgan = require("morgan");
app.use(morgan("dev"));

//routes
const auth = require("./routes/auth");
const users = require("./routes/users");
const posts = require("./routes/posts");

app.get("/", (req, res) => {
  const doc = fs.readFileSync("./docs/apiDocs.json");
  res.json(JSON.parse(doc));
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/posts", posts);

//error handling middleware
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// server configuration
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`.inverse);
});

process.on("unhandledRejection", (err) => {
  console.log(err.message);
  server.close(() => {
    process.exit(1);
  });
});
