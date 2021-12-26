/* 
    Routes:
    GET /api/users get user details
    POST /api/users register user
    POST /api/users/login login user
    POST /api/users/logout logout user
    
    GET /api/todos get all todos
    POST /api/todos create new todo
    DELETE /api/todos/:id deleted a specific todo
    PATCH /api/todos/:id marks toggles completion
*/

/*
    Env vairables:
    DB_URL
    COOKIE_SECRET
    STORE_SECRET
    TODO_TEXT_SECRET
    PORT
    NODE_ENV
*/

const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const PassportLocal = require('passport-local');
const User = require('./models/User');
const apiRouter = require('./routes/api');
const MongoStore = require('connect-mongo');
const path = require('path');

const database = require('./config/database');
database.connect();

app.use(express.json());

app.use(session({
    name: 'session',
    secret: process.env.COOKIE_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 30*24*60*60*1000
    },
    store: MongoStore.create({
        mongoUrl: database.dbUrl,
        crypto: {
            secret: process.env.STORE_SECRET || 'secret2'
        }
    })
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api',apiRouter);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../client/build')));
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname,'../client/build/index.html'));
    });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));