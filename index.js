var fs = require("fs");
var http = require("http");
var https = require("https");
var express = require("express");
var app = express();

// app.get("/api", function(req, res){
// 	res.send("HELLO WORLD");
// });

app.use("/", express.static("public"))
app.use("/", express.static("node_modules"))


var httpServer = http.createServer(app);
// var httpsServer = https.createServer({
// 	key: fs.readFileSync("sslcert/server.key", "utf8"),
// 	cert: fs.readFileSync("sslcert/server.crt", "utf8")
// }, app);

httpServer.listen(1111, function(){
	console.log("http at port 1111")
});
// httpsServer.listen(1112);
