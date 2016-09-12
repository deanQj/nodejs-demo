var mongodb = require("./mongodb");	// 顶会议用户组件
var mongoose = mongodb.mongoose;
var Schema = mongoose.Schema;		// 创建模型


var userScheMa = new Schema({ 		// 定义了一个新的模型，但是此模式还未和users集合有关联
	username: { 
		type: String,
		required: [true, '请输入用户名！']
		// enum: ['Coffee', 'Tea']
	},
	password: {
		type: String,
		required: [true, '请输入密码！']
	},
	phone: String,
	email: String,
	sex: Number,
	age: {
		type: Number,
		min:[18, '从你的年龄来看，还是个小屁孩！'],
		max:[120, '从你的年龄来看，您老肯定属乌龟的！']
	},
	level: {
		type: String,
		// default: "1",
		validate: [function(val){
			return val != "" && val != "0";
		},'请选择等级']
	},
	create_date: { 
		type: Date, 
		default: Date.now
	}
});	
var Users = mongoose.model('users', userScheMa);


var UsersDAO = function(){};

UsersDAO.prototype.findByQuery = function(query,callback) {
	Users.find(query, function(err, obj){
		callback(err, obj);
	});
};

UsersDAO.prototype.findById = function(query,callback) {
	Users.findOne(query, function(err, obj){
		callback(err, obj);
	});
};

UsersDAO.prototype.findPagination = function(condition,callback) {

	let q = condition.querys||{},
		sort = condition.sort||"",
		skipFrom = parseInt(condition.offset)||0,
		limit = parseInt(condition.limit)||10;

	if (condition.order=="desc") {
		sort = "-" + sort;
	}

	let query = Users.find(q).sort(sort).skip(skipFrom).limit(limit);

	query.exec(function (err, doc) {
		if (err) {
			callback(err, null, null);
		} else {
			Users.count(q, function(err, count) {
				if (err) {
					callback(err, null, null);
				} else {
					// let total = Math.ceil(count / limit);
					callback(err, count, doc);
				}
			});
		}
	});
};

UsersDAO.prototype.count = function(query,callback) {
	Users.count(query, function(err, count){
		callback(err, count);
	});
};

UsersDAO.prototype.login = function(query,callback) {
	Users.findOne(query, function(err, obj) {
		let errMsg;
		if (obj) {
			if (obj.level != "9") errMsg = "用户非管理员，禁止登陆！";
		} else {
			errMsg = "用户名或密码不正确！";
		}
		callback(errMsg, obj);
	});
};

UsersDAO.prototype.add = function(obj, callback) {
	var instance = new Users(obj);
	instance.save(function(err){
		callback(err);
	});
};

UsersDAO.prototype.delete = function(conds, callback) {
	Users.remove(conds,function(err) {
		callback(err)
	});
};

UsersDAO.prototype.update = function(obj, callback) {
	if (obj.password == "") {
		delete obj.password;
	}

	Users.update({_id: obj.id}, { $set: obj }, { runValidators: true }, function(err, data){
	    callback(err)
	})
};



module.exports = new UsersDAO();