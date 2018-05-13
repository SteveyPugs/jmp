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
const property = require("./routes/property");
const unit = require("./routes/unit");
const tenant = require("./routes/tenant");
const payment = require("./routes/payment");
const grievance = require("./routes/grievance");
const graph = require("./routes/graph");
app.use("/", index);
app.use("/register", register);
app.use("/login", login);
app.use("/property", property);
app.use("/unit", unit);
app.use("/tenant", tenant);
app.use("/payment", payment);
app.use("/grievance", grievance);
app.use("/graph", graph);
app.use("/", express.static("node_modules"));
app.use("/", express.static("static"));
app.listen(config.server.port, config.server.host, () => console.log("Opening on " + config.server.host + ":" + config.server.port))
if(config.server.dev){
	opn("http://" + config.server.host + ":" + config.server.port);	
}