const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const Todo = require('../../models/Todo');
const AppError = require('../../utils/AppError');
const wrapAsync = require('../../utils/wrapAsync');

router.get('/', middleware.ensureLogin, wrapAsync(async (req,res) => {
    const todos = [];
    for(const _id of req.user.todos){
        const todo = await Todo.findById(_id).exec();
        todos.push({
            _id: todo._id,
            text: todo.text,
            isCompleted: todo.isCompleted
        });
    }
    res.json(todos);
}));

router.post('/', middleware.ensureLogin, wrapAsync(async (req,res) => {
    const {text} = req.body;
    const todo = new Todo({
        text
    });
    await todo.save();
    await req.user.update({
        $push: {
            todos: todo._id
        }
    });
    res.json({
        _id: todo._id,
        text: todo.text,
        isCompleted: todo.isCompleted
    });
}));

router.delete('/:id', middleware.ensureLogin, middleware.authorizeTodo, wrapAsync(async (req,res) => {
    const {id} = req.params;
    await Todo.findByIdAndDelete(id);
    await req.user.update({
        $pull: {
            todos: id
        }
    });
    res.json({
        message: 'Delete successfull'
    });
}));

router.patch('/:id', middleware.ensureLogin, middleware.authorizeTodo, wrapAsync(async (req,res) => {
    const {isCompleted} = req.body;
    const {id} = req.params;
    if(isCompleted === undefined) return next(new AppError('isCompleted not found',400));
    await Todo.findByIdAndUpdate(id, {
        isCompleted
    });
    res.json({
        _id: id,
        isCompleted
    });
}));

module.exports = router;