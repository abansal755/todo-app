const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Todo = require('./models/todo');
const wrapAsync = require('./utils/wrapAsync');
const AppError = require('./utils/AppError');

(async function(){
    try{
        await mongoose.connect('mongodb://localhost/todoApp',{
            useNewUrlParser:true,
            useFindAndModify:false,
            useUnifiedTopology:true
        });
        console.log('MongoDB running...');
    }catch(err){
        console.log(err);
        process.exit(1);
    }
})();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));

app.listen(3000, () => console.log('Server running...'));

/*
GET / => the only page
GET /todos => sends all todos
POST /todos => creates a todo
PATCH /todos/:id => updates a specific todo
DELETE /todos/:id => deletes a specific todo
*/

app.get('/',(req,res) => {
    res.render('index');
});

app.get('/todos',wrapAsync(async (req,res) => {
    const todos = await Todo.find({}).exec();
    res.send(todos);
}));

app.post('/todos',wrapAsync(async (req,res) => {
    const {text} = req.body;
    const todo = new Todo({text,isCompleted:false});
    await todo.save();
    res.send(todo);
}));

app.patch('/todos/:id',wrapAsync(async (req,res) => {
    const {id} = req.params;
    const {text,isCompleted} = req.body;
    const todo = await Todo.findById(id).exec();
    if(text) todo.text = text;
    if(isCompleted) todo.isCompleted = isCompleted;
    await todo.save();
    res.send('ok');
}));

app.delete('/todos/:id',wrapAsync(async (req,res) => {
    const {id} = req.params;
    await Todo.findByIdAndDelete(id).exec();
    res.send('ok');
}));

app.use((req,res) => {
    throw new AppError('Not found',404);
});

app.use((err,req,res,next) => {
    if(!err.status) err.status = 500;
    if(!err.message) err.message = 'Something went wrong';
    res.status(err.status).send(err.message);
});