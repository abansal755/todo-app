const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const AppError = require('../../utils/AppError');
const middleware = require('../../middleware');
const passport = require('passport');

router.get('/', middleware.ensureLogin, (req,res) => {
    res.json({
        username: req.user.username
    });
});

router.post('/', middleware.ensureNoLogin, middleware.validateUsername, middleware.validatePassword, async (req,res,next) => {
    const {username,password} = req.body;
    const user = new User({
        username
    });
    try {
        await User.register(user,password);
    }
    catch(err) {
        return next(new AppError(err.message,400));
    }
    req.logIn(user, err => {
        if(err) return next(err);
        res.json({
            username
        });
    });
});

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