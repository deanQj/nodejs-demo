Node - express - mongoose - demo


构建项目：

	cd nodejs-demo && npm install


启动项目:

	安装nodemon：（ 开发过程中需要使用nodemon这么一个工具。nodemon用于动态识别开发过程中项目的改变，然后动态加载（这是Eclipse种开发java web类似）。该工具是开发web的必备啊）
	npm install nodemon -g

	修改app.js：
	把最有一行//module.exports = app;注释掉
	换成：app.listen(3000);

	使用下面命令启动app.js主程序：
	nodemon app.js


目录结构

	- bin, 存放启动项目的脚本文件

	- node_modules, 存放所有的项目依赖库。(每个项目管理自己的依赖，与Maven,Gradle等不同)

	- public，静态文件(css,js,img)

	- routes，路由文件(MVC中的C,controller)

	- views，页面文件(Ejs模板)

	- package.json，项目依赖配置及开发者信息

	- app.js，应用核心配置文件
