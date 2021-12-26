const AppError = require("./utils/AppError");
const validator = require('validator');

exports.ensureLogin = (req,res,next) => {
    if(req.isAuthenticated()) next();
    else throw new AppError('You must be logged in', 401);
}

exports.ensureNoLogin = (req,res,next) => {
    if(!req.isAuthenticated()) next();
    else throw new AppError('You must be logged out',403);
}

exports.authorizeTodo = (req,res,next) => {
    let found = false;
    for(const _id of req.user.todos){
        if(_id.toString() === req.params.id){
            found = true;
            break;
        }
    }
    if(found) next();
    else throw new AppError('Unauthorized',403);
}

exports.validateUsername = (req,res,next) => {
    const {username} = req.body;
    if(username === undefined) throw new AppError('Username not found',400);
    if(username.length < 6) throw new AppError('Username must be of atleast 6 characters',400);
    if(!validator.isAlphanumeric(username)) throw new AppError('Username must contain only alphanumeric characters',400);
    next();
}

exports.validatePassword = (req,res,next) => {
    const {password} = req.body;
    if(password === undefined) throw new AppError('Password not found',400);
    if(password.length < 6) throw new AppError('Password must be of atleast 6 characters',400);
    next();
}