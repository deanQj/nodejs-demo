var express = require('express');
var common = require('./common');
var UsersDAO = require('../models/users');
var router = express.Router();


/* 以下路由 - 无需身份验证 */
router.all('/', common.notAuthentication);

/**
 * 登录显示
 */
router.get('/', function(req, res, next) {
  	res.render('login', { title: '用户登录', baseUrl: req.baseUrl });
});

/**
 * 确认登录
 */
router.post('/', function(req, res, next) {
	UsersDAO.login(req.body, function(err, obj) {
		if (!err) {
			req.session.loginUser = obj;
			res.redirect('/home');
		} else {
			req.session.error = err;
			res.redirect('/login');
		}
	});
});



/* 以下路由 - 需要身份验证 */
router.get('/logout', common.authentication);

/**
 * 退出登录
 */
router.get('/logout',function(req, res, next) {
	req.session.loginUser = null;
	res.redirect('/');
});

module.exports = router;