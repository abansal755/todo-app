const AppError = require("./utils/AppError");

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
        if(_id.toString() === req.params.id) found = true;
    }
    if(found) next();
    else throw new AppError('Unauthorized',403);
}