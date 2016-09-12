// 加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//引入ejs。重新安装依赖
var ejs = require('ejs'); 

// 加载路由控制
var common = require('./routes/common');
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var home = require('./routes/home');

// 创建项目实例
var app = express();

// view engine setup (定义EJS模板引擎和模板文件位置，也可以使用jade或其他模型引擎)
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html'); //app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public （定义icon图标）
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// 定义日志和输出级别
app.use(logger('dev'));

// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 定义cookie解析器
app.use(cookieParser());

// 定义session
app.use(session({
  secret: '12345',
  name: 'testapp',         //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {maxAge: 800000}, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  resave: false,
  saveUninitialized: true
}));
app.use(function(req, res, next){
  res.locals.loginUser = req.session.loginUser;
    
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = '';
  if (err) 
    res.locals.message = `
      <div id="errorMessage" class="alert alert-danger alert-dismissible fade in" role="alert">
        <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        ${err} 
      </div>
    `;

  next();
});

// 共通下拉框数据集绑定到locals
app.use(common.localsSelectArrInit);

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 匹配路径和路由
app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/home', home);

// catch 404 and forward to error handler（404错误处理）
app.use(function(req, res, next) {
  var err = new Error('Ndorisot Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler （开发环境，500错误处理和错误堆栈跟踪）
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler （生产环境，500错误处理）
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//输出模型app
// module.exports = app;

app.listen(3000);
