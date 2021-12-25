const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const AppError = require('../../utils/AppError');
const middleware = require('../../middleware');
const passport = require('passport');
const wrapAsync = require('../../utils/wrapAsync');
const validator = require('validator');

router.get('/', middleware.ensureLogin, (req,res) => {
    res.json({
        username: req.user.username
    });
});

router.post('/', middleware.ensureNoLogin, wrapAsync(async (req,res) => {
    const {username,password} = req.body;
    
    // Validating username
    if(username === undefined) throw new AppError('Username not found',400);
    if(username.length < 6) throw new AppError('Username must be of atleast 6 characters',400);
    if(!validator.isAlphanumeric(username)) throw new AppError('Username must contain only alphanumeric characters',400);

    // Validating password
    if(password === undefined) throw new AppError('Password not found',400);
    if(password.length < 6) throw new AppError('Password must be of atleast 6 characters',400);
    if(!validator.isAlphanumeric(password)) throw new AppError('Password must contain only alphanumeric characters',400);
    
    const user = new User({
        username
    });
    try {
        await User.register(user,password);
    }
    catch(err) {
        throw new AppError(err.message,400);
    }
    req.logIn(user, err => {
        if(err) throw err;
        res.json({
            username
        });
    });
}));

router.post('/login', middleware.ensureNoLogin, (req,res,next) => {
    passport.authenticate('local', (err,user,info) => {
        if(!user) return next(new AppError(info.message,400));
        if(err) return next(err);
        req.logIn(user, err => {
            if(err) return next(err);
            res.json({
                username: user.username
            })
        });
    })(req,res,next);
});

router.post('/logout', middleware.ensureLogin, (req,res) => {
    req.logOut();
    res.json({
        message: 'Logout successfull'
    });
});

module.exports = router;