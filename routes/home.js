var express = require('express');
var common = require('./common');
var router = express.Router();

/* 以下路由 - 需要身份验证 */
router.get('/', common.authentication);

/**
 * 后台首页
 */
router.get('/', function(req, res, next) {
  	res.render('home', { title: 'HOME', baseUrl: req.baseUrl});
});

module.exports = router;