/**
 * Created by richardbrash on 1/4/16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) { res.render('junk'); });

module.exports = router;
