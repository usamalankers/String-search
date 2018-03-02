var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var MongoClient = require('mongodb').MongoClient;
var Mongo = require('mongodb');


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017");

var path = __dirname + '/views/';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

var nameSchema = new mongoose.Schema({
 Name: String,
 //text: true
});
var User = mongoose.model('User', nameSchema);
router.post("/addname", (req, res) => {
  var myData = new User(req.body);
  myData.save()
    .then(item => {
      res.send(req.body);
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

router.get('/search', (req, res) => {
  var myText = req.query.que;
  if (myText) {
    User.findOne({'Name': myText}, function(err, docs) {
      if (err) return handleError(err);
      res.send(docs.Name);
  });
  }
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function() {
  console.log("Live at Port 3000");
});
