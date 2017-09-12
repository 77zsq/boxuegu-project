// 当用户点击登陆按钮的时候，这个插件ajaxForm方法会自动监听submit事件
// 然后阻止浏览器默认的刷新提交，然后自动变成ajax的方式发送请求。


/* 因为登录成功后服务端会返回用户信息  code:200  tc_avatar:""   tc_name:"前端学院" 等
需要使用在跳转后的导航 要用localStorage存储
localStorage不能存储对象 只能存储字符串  用JSON.stringify将数据转换成字符串
不用变量  因为登录成功后 页面会调到新的页面 每个页面的变量是独立的 */



$('#login-form').ajaxForm({
    success: function(data) {
        if (data.code == 200) {
            alert('登陆成功');
            console.log(data)
            console.debug

            localStorage.setItem('userinfo', JSON.stringify(data.result));
            location.href = '/dist';
        } else {
            alert('登陆失败');
        }
    },
    error: function() {
        alert('登陆失败');
    }
});



// $('#login-form').on('submit', function(e) {

//     $.ajax({
//         url: '/v6/login',
//         type: 'post',
//         data: $(this).serialize(),
//         success: function(data) {
//             if(data.code == 200) {
//                 alert('登陆成功');
//             }else {
//                 alert('登陆失败');
//             }
//         },
//         error: function() {
//             alert('登陆失败');
//         }
//     });

//     // jquery中阻止浏览器默认事件return false即可
//     return false;
// });