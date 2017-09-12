//使用这些包 直接require('包的名字')
//这些包都安装在node_modules中
//在node中（也可以认为是规范的一部分），如果输入字符串 前面没有'/或者 ./ 或者../' 
//会认为是一个包 会从目录文件夹中找，即node_modules中找
//每一个包中有入口文件，加载某个js，得到js的返回结果，加载的js中有module.export

//以gulp为例   var gulp = require('gulp');  找到node_modules中的gulp 中的package.json(描述文件)
//package.json(描述文件)中有main ，没有的话 就找index.js
//运行index.js脚本 ，拿到 module.exports = inst;  而inst是Gulp构造函数的一个对象 var inst = new Gulp();
//即我们拿到的是一个Gulp实例

//node包 都是通过require加载东西  通过exports导出东西 但是浏览器不支持 所以有browserify打包
//有browserify.所有node里面的代码 基本可以放到浏览器执行


// 导入各种包
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var browserify = require('browserify');
//以下两个是兼容性的包
var source = require('vinyl-source-stream'); // 这个包可以把普通的数据流转为vinyl对象文件格式
var buffer = require('vinyl-buffer'); // 这个是把vinyl对象文件中的数据转为buffer方式存储


// html处理
gulp.task('html', function() {
    gulp.src(['src/**/*.html', 'index.html'])

    .pipe(htmlmin({
            collapseWhitespace: true, // 去掉空白字符
            minifyJS: true, //压缩页面JS
            minifyCSS: true, //压缩页面CSS
            removeComments: true //清除HTML注释
        }))
        .pipe(gulp.dest('dist'));
});

// less处理
gulp.task('less', function() {
    gulp.src('src/less/index.less')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/css'));
});

// 配置要打包的第三包路径
var jsLibs = [
    'node_modules/art-template/lib/template-web.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/jquery-form/dist/jquery.form.min.js'

];

// 合并所有的第三方包为一个js
gulp.task('jsLib', function() {
    gulp.src(jsLibs)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('dist/js'));
});



/**
 * 自己写的JS用的是commonJS的写法 不能简单的合并 需要通过browserify转换
 * 才能在浏览器运行
 * 打包CommonJS模块：
 * 1、其中src/js/common目录下的文件不需要打包，因为将来那个页面脚本需要它，require它即可，
 * 只要require了，就自动打包到了对应的页面脚本。
 * 2、剩下其他目录的js都要打包，每个js都对应一个html页面，他们是这些页面的入口文件。
 * 但是browserify不支持通配符写法，我们只能一个一个写。
 *    一个一个写比较费力，我们这里采用一个循环结构来处理，搞循环结构，
 * 通常要有一个对象或者数组，我们搞一个存储所有要打包js路径的数组，然后遍历打包。
 * */

/* 需求：把jsModules中的JS通过browserify打包处理，因为所有的代码都要用commonJS来写 */
/* commonJS -- 要在一个文件中加载使用其他文件 通过require()去加载  与gulp一样 加载很多第三方包*/
/* 而要通过require()这样用 必须打包 否则JS在浏览器中不能执行*/
var jsModules = [
    //首页
    'src/js/index.js',
    //用户
    'src/js/user/login.js',
    'src/js/user/repass.js',
    'src/js/user/profile.js',
    //讲师
    'src/js/teacher/add.js',
    'src/js/teacher/edit.js',
    'src/js/teacher/list.js',
    //课程
    'src/js/course/add.js',
    'src/js/course/edit1.js',
    'src/js/course/edit2.js',
    'src/js/course/edit3.js',
    'src/js/course/list.js',
    //学科分类
    'src/js/category/add.js',
    'src/js/category/edit.js',
    'src/js/category/list.js'
];
// 打包CommonJS模块
gulp.task('js', function() {

    browserify('src/js/index.js', { debug: true }).bundle() // 打包index.js
        .pipe(source('index.js'))
        .pipe(buffer())
        // .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});


/* 以'src/js/index.js','src/js/user/login.js',为例 */
/* var arr = ['src/js/index.js,'src/js/user/login.js'] */
gulp.task('js', function() {
    jsModules.forEach(function(jsPath) {
        var pathArr = jsPath.split('/'); // jsPath变成['src', 'js', 'user', 'login.js']
        var jsName = pathArr.pop(); // 取出login.js，数组变成['src', 'js', 'user']
        pathArr.shift(); // 取出src，数组变成['js', 'user']



        // 不是gulp.src读取文件，直接通过browserify读取文件打包，因为browserify不是gulp插件
        //{ debug: true }便于调试  
        //加了{ debug: true } 在source中查看源代码 能看到压缩的代码  也能看到没有压缩的代码
        //browserify输出的结果和gulp不兼容 所以要借助source buffer转换以兼容gulp
        //才可以继续调用gulp插件 否则输出结果调用不了gulp插件
        browserify(jsPath, { debug: true }).bundle() // 打包index.js
            .pipe(source(jsName))
            .pipe(buffer())
            // .pipe(uglify())   加了uglify()  { debug: true }没有用  
            //uglify()会去掉JS中的注释  { debug: true }靠注释实现
            //使用 { debug: true }，打包后的文件是由哪几个文件打包的  浏览器有读取 做映射 显示
            .pipe(gulp.dest('dist/' + pathArr.join('/'))); // 数组变成'js/user'
    });
});

// 添加统一打包的任务 (先构建任务)
gulp.task('build', function() {
    gulp.run(['html', 'less', 'jsLib', 'js']);
});
// 监听文件变化，自动打包
gulp.task('default', function() {
    gulp.run('build');
    gulp.watch(['src/**/*.html', 'index.html'], function() {
        gulp.run('html');
    });
    gulp.watch(['src/**/*.less'], function() {
        gulp.run('less');
    });
    gulp.watch(['src/**/*.js'], function() {
        gulp.run('js');
    });
});