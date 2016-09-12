var express = require('express');
var common = require('./common');
var UsersDAO = require('../models/users');
var router = express.Router();


/* 以下路由 - 需要身份验证 */
router.get('/', common.authentication);
router.get('/add', common.authentication);
router.get('/edit/:id', common.authentication);
router.post('/delete/:id', common.authentication);


/**
 * 用户列表
 */
router.get('/', function(req, res, next) {
	res.render('users', { title: '用户列表', baseUrl: req.baseUrl});
});


/**
 * 用户列表异步获取列表信息（带分页）
 */
router.post('/', function(req, res, next) {

	let condition = req.body;
	condition.querys = JSON.parse(req.body.querys);
	if (condition.querys.username) {
		condition.querys.username = new RegExp(condition.querys.username);
	} else {
		delete condition.querys.username;
	}
	if (condition.querys.level && condition.querys.level == "0") {
		delete condition.querys.level;
	}

	UsersDAO.findPagination(condition, function(err,total, doc) {
		res.send({rows: doc, total: total});
	});
});


/**
 * 添加用户
 */
router.get('/add', function(req, res, next) {
	res.render('editUser', { title: '添加用户', user: {}, baseUrl: req.baseUrl});
});

/**
 * 添加用户 - 保存
 */
router.post('/add', function(req, res, next) {
	UsersDAO.add(req.body, function(err) {
		if (!err) {
			res.redirect('/users');
		} else {
			common.setSessionErrorMsg(req, err);
			res.redirect('/users/add');
		}
	});
});


/**
 * 编辑用户
 */
router.get('/edit/:id', function(req, res, next) {
	var user = {},
		query = {};

	if(req.params.id) {
		query['_id'] = req.params.id;
	}
	
	UsersDAO.findById(query,function(err, obj){
		if (!err) {
			user = obj;
		}

  		res.render('editUser', { title: '编辑用户', user: user, baseUrl: req.baseUrl});
	});
});


/**
 * 编辑用户 - 保存
 */
router.post('/edit/:id', function(req, res, next) {
	UsersDAO.update(req.body, function(err) {
		if (!err) {
			res.redirect('/users');
		} else {
			common.setSessionErrorMsg(req, err);
			res.redirect('/users/edit/'+req.params.id);
		}
	});
});


/**
 * 删除用户
 */
router.post('/delete', function(req, res, next) {
	var query = {};

	if(req.body.ids) {
		query['_id'] = { $in: JSON.parse(req.body.ids) };

		UsersDAO.delete(query, function(err, obj){
			var error = '';
			if (err) {
				error = '用户删除失败！';
			} 
			res.send({err:error});
		});
	} else {
		res.send({err:'用户ID不存在！'});
	}

	
});

module.exports = router;
