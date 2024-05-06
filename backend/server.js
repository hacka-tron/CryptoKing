const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
const serverless = require("serverless-http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const port = process.env.ENV == "Lambda" ? process.env.PORT || "3000" : normalizePort(process.env.PORT || "3000");
app.set("port", port);

if (process.env.ENV == 'Lambda') {
  const handler = serverless(app);

  module.exports.handler = async (event, context) => {
    const result = await handler(event, context);
    return result;
  };

} else {

  const onError = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
  };
  
  const server = http.createServer(app);
  server.on("error", onError);
  server.on("listening", onListening);
  server.listen(port);
}
