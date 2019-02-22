//评论分页
var perpage = 2;
var page = 1;
var pages = 1;
var comments = [];

$('.commentBtn').on('click', function () {
    $.ajax({
        type: 'post',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('.neirong').val()
        },
        success: function (res) {
            // console.log(res);
            $('.neirong').val(''); //清空评论区
            comments = res.data.comments.reverse();
            renderComment();
        }
    })
})

// function renderComment(comments) {
//     var html = '';
//     for (var i = 0; i < comments.length; i++) {
//         html += `<li style="padding: 10px;border: 1px solid;margin-bottom: 20px;">
//                 <div style="font-weight: bold;justify-content: space-between;display: flex;">
//                     <p>${comments[i].userName}</p>
//                     <p>${comments[i].postTime}</p>
//                 </div>
//             <div>'${comments[i].content }</div>
//         </li>`
//     }
//     $('.megList').html(html);
// }

//二十五
//每次页面加载获取该文章的所有评论
$.ajax({
    type: 'get',
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success: function (res) {
        comments = res.data.reverse();
        renderComment();
    }
})

//提交评论
function renderComment() {
    $('.pinglunshu').html(comments.length);
    var totalFake = comments.length==0?1:comments.length; 
    pages = Math.ceil(totalFake / perpage, 1);
    var start = Math.max(0, (page - 1) * perpage); //起始页
    var end = Math.min(start + perpage, comments.length); //终止页
    var spans = $('.a-page > span');
    spans.eq(1).html(page + '/' + pages);
    //没有上一页判断
    if (page <= 1) {
        page = 1;
        spans.eq(0).html('<span>没有上一页了</span>');
    } else {
        spans.eq(0).html('<a href="javascript:void(0)">上一页</a>');
    }
    //没有下一页判断
    if (page >= pages) {
        page = pages;
        spans.eq(2).html('<span>没有下一页了</span>');
    } else {
        spans.eq(2).html('<a href="javascript:void(0)">下一页</a>');
    }
    if (comments.length == 0) {
        $('.megList').html('<li style="text-align:left;">还没有评论</li>');
    } else {
        var html = '';
        for (var i = start; i < end; i++) {
            html += `<li style="padding: 10px;border: 1px solid;margin-bottom: 20px;">
                <div style="font-weight: bold;justify-content: space-between;display: flex;">
                    <p>${comments[i].userName}</p>
                    <p>${formatDate(comments[i].postTime)}</p>
                </div>
                <div>${comments[i].content}</div>
            </li>`;
        }
        $('.megList').html(html);
    }

}
//格式化时间
function formatDate(date) {
    var date1 = new Date(date);
    return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + ' ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds()
}
//分页处理
$('.a-page').delegate('a','click',function(){
	if($(this).parent().hasClass('pre')){
		page --;
	}else{
		page ++;
	}
	renderComment();
})