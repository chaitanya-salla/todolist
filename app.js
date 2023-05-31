const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let tasks = [];
let workItems = [];

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const today = new Date();
const fullDate = today.toLocaleDateString("en-US", options);

const url = "mongodb+srv://username:Password@cluster0.8cblm9v.mongodb.net/todoListDB?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser : true});

const itemsSchema = {
  name: String
}

const Item = mongoose.model('Item', itemsSchema);


app.get("/", (req, res) => {
  Item.find({})
  .then(tasks => res.render("list", { listTitle: fullDate, tasks }))
  .catch(err => console.log(err));
  
});

app.post("/", (req, res) => {
  const task = req.body.newItem;
  const item = new Item ({
    name:task
  });
  item.save();
  res.redirect('/');
});


app.post('/delete', (req, res) => {
  const checkItemId = req.body.checkbox;
  Item.findByIdAndDelete(checkItemId)
  .then(data => console.log('Successfully deleted',data))
  .catch(err => console.log(err));
  res.redirect('/');
})
app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work", tasks: workItems });
});

app.post("/work", (req, res) => {
  const task = req.body.newItem;
  
  workItems.push(task);
  res.redirect("/work");
});

app.listen(3000, () => {
  console.log("Server Started on 3000");
});
