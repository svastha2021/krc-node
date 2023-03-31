const app = require("./main");

var list = app.listen(process.env.HOST_PORT, function () {
  console.log("Users listening on port " + process.env.HOST_PORT);

  console.log("db host " + process.env.WRITE_DB_SRV_HOST)
})