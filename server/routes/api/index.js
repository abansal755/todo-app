const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const todosRouter = require('./todos');

router.use('/users',usersRouter);
router.use('/todos',todosRouter);

router.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).json({
        error: {
            message
        }
    });
});

module.exports = router;