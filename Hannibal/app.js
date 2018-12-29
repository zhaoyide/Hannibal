const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();

app.use(cookieParser());
app.use(session({
  name: 'hannibal_id',
  secret: 'hannibal',
  cookie: {
    maxAge: 6000000
  },
  resave: false,
  saveUninitialized: true,
}));

app.use(fileUpload());
const path = require("path");
const static = express.static(__dirname + "/public");
const pic = express.static(__dirname + "/pics");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");


const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  },
  partialsDir: ["views/partials/"]
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use("/hannibal/public", static);
app.use("/hannibal/pics", pic);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.engine("handlebars",  handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
