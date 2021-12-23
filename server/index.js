/* 
    GET / home page
    GET /login login page
    GET /register register page
    GET /dashboard dashboard page

    // GET /api/users get user details
    // POST /api/users register user
    // POST /api/users/login login user
    // POST /api/users/logout logout user
    
    // GET /api/todos get all todos
    GET /api/todos/:id gets a specific todo
    // POST /api/todos create new todo
    // DELETE /api/todos/:id deleted a specific todo
    // PATCH /api/todos/:id marks toggles completion
*/

const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const PassportLocal = require('passport-local');
const User = require('./models/User');
const apiRouter = require('./routes/api');

const database = require('./config/database');
database();

app.use(express.json());
app.use(session({
    name: 'session',
    secret: process.env.SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 30*24*60*60*1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api',apiRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));