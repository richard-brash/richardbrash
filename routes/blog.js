var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    console.log("*** Here we are in the blog route ***");
    res.render('index');

});

module.exports = router;
