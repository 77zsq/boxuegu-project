// 退出功能



$('#btn-logout').on('click', function() {
    // 没有表单 只能用$.ajax()
    $.ajax({
        url: '/v6/logout',
        type: 'post',
        success: function(data) {
            if (data.code == 200) {
                alert('退出成功');
                location.href = '/dist/html/user/login.html';
            }
        }
    });
});