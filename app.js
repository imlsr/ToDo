const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();



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

const listSchema = {
    name:String,
    items : [itemsSchema]

};

const List = mongoose.model("List", listSchema);




app.get("/", function(req, res){


  let today = new Date();

  let options = {
    weekday : "long",
    day:"numeric",
    month:"long"

  };

  let day = today.toLocaleDateString("en-US",options);

  Item.find({},function(err, foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultitems , function(err){
        if(err){
          console.log(err);
        }else{
          console.log("success");
          }
        });
        res.redirect("/");
      }else{
    res.render("list",{listtitle:day, newtask:foundItems});
  }
});

});


app.get("/:customlistname",function(req,res){
  const customlistname = req.params.customlistname;

  List.findOne({name:customlistname},function(err,res){
    if(!err){
      if(!res){
        const list = new List({
            name:customlistname,
            items: defaultitems
          });
          list.save();
      }else{

        res.render("list",{listtitle:day, newtask:foundItems})

      }

    }
  });



app.post("/", function(req,res){
  const itemname = req.body.newitem;
  const item = new Item({
    name : itemname
  })

  item.save();

  res.redirect("/")



  // if(req.body.list === "work"){
  //
  //   work.push(task);
  //   res.redirect("/work");
  //
  // }else{
  //   items.push(task);
  //   res.redirect("/");
  //
  // }



});


app.post("/delete", function(req,res){

  const checkedid = req.body.checkbox;
  Item.findByIdAndRemove(checkedid,function(err){
    if(!err){
      console.log("deleted!!");
      res.redirect("/")
    }else{
      console.log(err);
    }
  })


})


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
