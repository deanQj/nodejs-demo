/**
 *  需要身份验证
 */
exports.authentication = function(req, res, next) {
	if (!req.session.loginUser) {
		req.session.error = "请先登录";
		return res.redirect('/login');
	}
	next();
}

/**
 *  无需验证身份
 */
exports.notAuthentication = function(req, res, next) {
	if (req.session.loginUser) {
		req.session.error='已登陆';
		return res.redirect('/');
	}
	next();
}


/**
 * 下拉框数据集
 */
var localsSelectArr = {
	// 会员等级列表
	levelArr : {
		"0" : "请选择",
		"1" : "普通会员",
		"9" : "管理员",
	}
};


/**
 * 把下拉框数据集绑定到locals上
 */
exports.localsSelectArrInit = function(req, res, next) { 
	for (var k in localsSelectArr) {
		res.locals[k] = localsSelectArr[k];
	}
	next();
}


exports.setSessionErrorMsg = function(req, err) {
	let errors = err.errors,
		arr = [];
	for (let k in errors) {
		arr.push(`<p>${errors[k].message}</p>`);
	}
	req.session.error = arr.join('');
}