const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const chatRouter = require("./routes/chatRouter");
const messageRouter = require("./routes/messageRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//GLOBAL MIDDLEWARES
app.use(cors());

//dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);

//ROUTES
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
//START THE SERVER
module.exports = app;
