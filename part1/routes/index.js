var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/dogs', function(req,res,next){
  
});

router.get('/api/walkrequests/open', function(req,res,next){

});

router.get('/api/walkers/summary', function(req,res,next){

});

module.exports = router;
