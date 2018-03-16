const express = require("express");
const opn = require("opn");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set("view engine", "pug");
app.use(cookieParser());
const index = require("./routes");
const register = require("./routes/register");
const login = require("./routes/login");
app.use("/", index);
app.use("/register", register);
app.use("/login", login);
app.use("/", express.static("node_modules"));
app.use("/", express.static("static"));

app.listen(config.server.port, config.server.host, () => console.log("Opening on " + config.server.host + ":" + config.server.port))

if(config.server.dev){
	opn("http://" + config.server.host + ":" + config.server.port);	
}