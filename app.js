const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

var items = [];
var work = [];

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser :true});

const itemsSchema = {
  name:String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name : "Welcome"
});

const item2 = new Item({
  name : "To"
});

const item3 = new Item({
  name : "Likith"
});

const defaultitems  = [item1,item2,item3];

 Item.insertMany(defaultitems , function(err){
   if(err){
     console.log(err);
   }else{
     console.log("success");
   }
 })






app.get("/", function(req, res){


  let today = new Date();

  let options = {
    weekday : "long",
    day:"numeric",
    month:"long"

  };

  let day = today.toLocaleDateString("en-US",options);

  Item.find({},function(err, foundItems){
    res.render("list",{listtitle:day, newtask:foundItems});
  })



});



app.post("/", function(req,res){
  let task = req.body.newitem;


  if(req.body.list === "work"){

    work.push(task);
    res.redirect("/work");

  }else{
    items.push(task);
    res.redirect("/");

  }



});

app.get("/work",function(req,res){
  res.render("list",{listtitle:"work", newtask:work});

})


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
