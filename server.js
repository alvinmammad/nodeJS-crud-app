const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://alvinmammad:xEGFA6VhNlaKg2yE@connectapi.zcn6c.mongodb.net/connect?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then((res) => {
    console.log("Connected to DB 👍 !");
  })
  .catch((err) => {
    console.log("Not connected to db 😢");
  });
mongoose.Promise = global.Promise;
mongoose.connection.on("error", (err) => {
  console.error(`DB connection error -> ${err.message}`);
});

const app = require("./app");

