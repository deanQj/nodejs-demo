var express = require('express');
var router = express.Router();
var UsersDAO = require('../models/users');

/**
 * 后台首页
 */
router.get('/', function(req, res, next) {
  	res.render('index', { title: '首页', baseUrl: req.baseUrl});
});

module.exports = router;
