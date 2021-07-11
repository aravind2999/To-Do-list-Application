const express = require('express')
const app = express()
const request = require('request')
const dotenv = require("dotenv")

//Accesing models folder
const TodoTask = require("./models/ToDoTask");

//ejs => embedded javascript
app.set("view engine","ejs");

//To use static files
app.use("/static",express.static("public"))

//Urlencoded will allow us to extract the data from the form by adding her to the body property of the request.
app.use(express.urlencoded({extended: true}))


dotenv.config()

//GET METHOD
app.get('/',(req,res)=>{
    TodoTask.find({},(err,tasks)=>{
        res.render("todo.ejs",{todoTasks: tasks})
    })
    // res.render('todo.ejs')
});

//connection to db
const mongoose = require("mongoose");
//connection to db
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Connected to db!");
    mongoose.connection.useDb('test')
    app.listen(3000, () => console.log("Server Up and running"));
});
//POST METHOD
// app.post('/',async(req,res)=>{
//     //req.body will allow to access the data in string or json object from the client side
//     //generally used to obtain data through POST and PUT requests in Express server
//     // console.log(req.body)4

//     const todoTask = new TodoTask({
//         content : req.body.content
//     })
//     try{
//         await todoTask.save()
//         res.redirect("/")
//     }
//     catch(err){
//         res.redirect("/")
//     }
// })
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500,err);
        
            res.redirect("/");
        });
    });
    //DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.status(500).send(err);
        res.redirect("/");
    });
});
// app.listen(3000,()=>{
//     console.log("Server started at 3000")
// })