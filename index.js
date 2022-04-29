const app = require("./main");

var list = app.listen(process.env.HOST_PORT, function () {
  console.log("Users listening on port " + process.env.HOST_PORT);
})