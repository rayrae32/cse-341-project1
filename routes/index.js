const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Hello World]
    res.send('Welcome to the API documentation!');
});

router.use('/users', require('./users'));

module.exports = router;