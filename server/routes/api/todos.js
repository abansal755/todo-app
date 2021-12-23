const express = require('express');
const router = express.Router();
const middleware = require('../../middleware');
const Todo = require('../../models/Todo');
const AppError = require('../../utils/AppError');

router.get('/', middleware.ensureLogin, async (req,res,next) => {
    const todos = [];
    try {
        for(const _id of req.user.todos){
            const todo = await Todo.findById(_id).exec();
            todos.push({
                _id: todo._id,
                text: todo.text,
                isCompleted: todo.isCompleted
            });
        }
        res.json(todos);
    }
    catch(err) {
        next(err);
    }
});

router.post('/', middleware.ensureLogin, async (req,res,next) => {
    const {text} = req.body;
    const todo = new Todo({
        text
    });
    try {
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
    }
    catch(err) {
        next(err);
    }
});

router.delete('/:id', middleware.ensureLogin, middleware.authorizeTodo, async (req,res,next) => {
    const {id} = req.params;
    try {
        await Todo.findByIdAndDelete(id);
        await req.user.update({
            $pull: {
                todos: id
            }
        });
        res.json({
            message: 'Delete successfull'
        });
    }
    catch(err) {
        next(err);
    }
});

router.patch('/:id', middleware.ensureLogin, middleware.authorizeTodo, async(req,res,next) => {
    const {isCompleted} = req.body;
    const {id} = req.params;
    if(isCompleted === undefined) return next(new AppError('isCompleted not found',400));
    try {
        await Todo.findByIdAndUpdate(id, {
            isCompleted
        });
        res.json({
            _id: id,
            isCompleted
        });
    }
    catch(err) {
        next(err);
    }
})

module.exports = router;