const express = require("express");
const bodyparser = require("body-parser");

const app = express();

var items = [];

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  var today = new Date();

  var options = {
    weekday : "long",
    day:"numeric",
    month:"long"

  };

  var day = today.toLocaleDateString("en-US",options);
  res.render("list",{kindofday:day, newtask:items});

});


app.post("/", function(req,res){

  var task = req.body.newitem;

  items.push(task);

  res.redirect("/");
});


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
