const express = require("express");
const opn = require("opn");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multipart = require("connect-multiparty");
const config = require("./config");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(multipart({
	uploadDir: __dirname + "/tmp"
}));
const index = require("./routes");
const property = require("./routes/property");
const unit = require("./routes/unit");
const tenant = require("./routes/tenant");
const payment = require("./routes/payment");
const grievance = require("./routes/grievance");
const graph = require("./routes/graph");
app.use("/", index);
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