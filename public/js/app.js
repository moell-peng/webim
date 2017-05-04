$(function() {
    $(".message .send").click(function(){
        var text = $(".message .text textarea");
        var msg = text.val();

        if ($.trim(msg) == '') {
            layer.msg('请输入消息内容', {time: 1000, icon:5})
            return false;
        }

        var html = '<div class="col-xs-10 col-xs-offset-2 msg-item ">'
            +'<div class="col-xs-1 no-padding pull-right">'
                +'<div class="avatar">'
                    +'<img src="http://moell.cn/uploads/avatar/71efddad30a9d182083721dfcfc6c6ea.jpg" width="30" height="30" class="img-circle">'
                +'</div>'
            +'</div>'

            +'<div class="col-xs-11">'
                +'<div class="msg pull-right">'+msg+'</div>'
            +'</div>'
        +'</div>';

        $('.chat-list').append(html);

        appendUser('moell', 'd', 'd');
        scrollBottom();

        text.val('');
    });

});

function scrollBottom() {
    $('.chat-list').scrollTop($('.chat-list')[0].scrollHeight );
}

function notice(msg) {
    var html ='<div class="col-xs-12 notice text-center">'+msg+'</div>';
    $('.chat-list').append(html);

    scrollBottom();
}


function appendUser(name, avatr, fid) {
    var html = ' <div class="user-item">'
        +'<div class="avatar">'
            +'<img src="http://moell.cn/uploads/avatar/71efddad30a9d182083721dfcfc6c6ea.jpg" width="30" height="30" class="img-circle">'
        +'</div>'
        +'<div class="user-name">'+name+'</div>'
    +'</div>';

    $(".user-list").append(html);
    $('.user-list').scrollTop($('.user-list')[0].scrollHeight );
}

function newMessage(msg, avatr) {

    var html = '<div class="col-xs-10 msg-item ">'
        +'<div class="col-xs-1 no-padding">'
            +'<div class="avatar">'
                +'<img src="http://moell.cn/uploads/avatar/71efddad30a9d182083721dfcfc6c6ea.jpg" width="30" height="30" class="img-circle">'
            +'</div>'
        +'</div>'

        +'<div class="col-xs-11 no-padding">'
            +'<div class="msg">'+msg+'</div>'
        +'</div>'
    +'</div>';

    $('.chat-list').append(html);
    scrollBottom();
}
