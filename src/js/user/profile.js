require('../common/header.js');
require('../common/aside.js');
require('../common/loading.js');
require('../common/common.js');

/**
 * 该页面功能点：
 * 1、数据回显(用ajax请求数据)  value值 -- 回显
 * 2、修改数据后 表单提交       name值  -- 提交
 */

/**
 * 数据回显：
 * 1、请求接口获取当前用户的信息
 * 2、使用模版引擎把数据嵌入到模版当中，得到数据渲染后的模版
 * 基本语法：var html = template('id', data)
 * 3、把渲染后的模版插入到页面指定位置
 */
$.ajax({
    url: '/v6/teacher/profile',
    type: 'get',
    success: function(data) {
        if (data.code == 200) {
            $('.teacher-profile').html(template('teacher-profile-tpl', data.result));
            /* 请求一个接口（异步）'/v6/teacher/profile', 成功后把template模板放到页面中*/
            /*请求一个接口（异步）代码从上往下执行 ，数据还没有返回 继续往下执行 获取不到表单 */
        }
    }
});



/**
 * 表单提交：
 * 1、因为表单要进行数据回显，所以是动态异步创建出来的。
 * 动态创建的元素可以用事件委托的方式绑定
 * 我们这里要通过插件的ajaxForm监听表单提交事件必须使用委托的方式，插件提供了delegation选项配置为true即可。
 * 2、修改成功后给个用户提示
 * */
$('#teacher-profile-form').ajaxForm({
    delegation: true,
    success: function(data) {
        if (data.code == 200) {
            alert('修改成功');
        }
        console.log(data);
    }
});

// {"code":500,"msg":"Undefined index: tc_id","time":1505212718}
//提交的时候必须有tc_id字段
//数据回显的时候拿到tc_id ，提交的时候再传就好了（验证id 能否保持正确 正确修改对应讲师）