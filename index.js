const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("express-async-errors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const limiter = require("./Middlewares/rate-limiter");



dotenv.config();

const usersRoutes = require("./routes/usersRoutes");
const postsRoutes = require("./routes/postsRoutes");

const APIError = require("./util/APIError");

const errorhandler = require("./Middlewares/errorhandlers");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(limiter);

// Routes
const V1_PREFIX = "/api/v1";
app.use(`${V1_PREFIX}/users`, usersRoutes);

app.use(`${V1_PREFIX}/posts`, postsRoutes);
app.use((req, res, next) => {
  next(new APIError(404, `${req.method} ${req.path}not found`));
});

app.use(errorhandler);

const PORT = process.env.PORT ;
const MONGO_URI = process.env.MONGO_URI;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose.connect(MONGO_URI)
   .then(() => console.log("Connected to MongoDB "))
   .catch((err) => console.error(`Failed to connect to MongoDB: ${err.message}`));

});
