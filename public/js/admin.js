$(function () {
	var setAdminBtn = $('button.setAdminBtn');
    //修改管理员状态
    setAdmin=(name,isAdmin)=>{
        console.log(name,isAdmin)
        $.ajax({
			type: 'post',
            url: '/api/user/setAdmin',
            data: {
				userName: name,
				isAdmin: isAdmin, 
			},
			dataType: 'json',
			success: function (res) {
                console.log(res)
                if (!res.code) {
					window.location.reload();
				}
			}
		})
    }
})