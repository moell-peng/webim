$(function() {
  webim.init();

  $(".message .send").click(function(){
    webim.sendMsg();
  });
});

var config = {
  server : 'ws://127.0.0.1:9501'
};

var webim = {
  data : {
    wsServer : null,
    info : {}
  },
  init : function() {
    this.data.wsServer = new WebSocket(config.server);
    this.open();
    this.close();
    this.messages();
    this.error();
  },
  open : function() {
    this.data.wsServer.onopen = function(evt) {
      webim.notice('连接成功');
    }
  },
  close : function() {
    this.data.wsServer.onclose = function(evt) {
      webim.notice('不妙，链接断开了');
    }
  },
  messages : function() {
    this.data.wsServer.onmessage = function (evt) {
      var data = jQuery.parseJSON(evt.data);
      switch (data.type) {
        case 'open':
          webim.appendUser(data.user.name, data.user.avatar, data.user.fd);
          webim.notice(data.message);
          break;
        case 'close':
          webim.removeUser(data.user.fd);
          webim.notice(data.message);
          break;
        case 'openSuccess':
          webim.data.info = data.user;
          webim.showAllUser(data.all);
          break;
        case 'message':
          webim.newMessage(data);
          break;
      }
    };
  },
  error : function() {
    this.data.wsServer.onerror = function (evt, e) {
      console.log('Error occured: ' + evt.data);
    };
  },
  removeUser: function(fd) {
    $(".fd-"+fd).remove();
  },
  showAllUser: function(users) {
    for (i in users) {
      this.appendUser(users[i].name, users[i].avatar, users[i].fd);
    }
  },
  sendMsg : function() {

    var text = $(".message .text textarea");
    var msg = text.val();
    if ($.trim(msg) == '') {
      this.layerErrorMsg('请输入消息内容');
      return false;
    }

    this.data.wsServer.send(msg);

    var html = '<div class="col-xs-10 col-xs-offset-2 msg-item ">'
      +'<div class="col-xs-1 no-padding pull-right">'
      +'<div class="avatar">'
      +'<img src="'+this.data.info.avatar+'" width="50" height="50" class="img-circle">'
      +'</div>'
      +'</div>'

      +'<div class="col-xs-11">'
      +'<div class="col-xs-12">'
      +'<div class="username pull-right">'+this.data.info.name+'</div>'
      +'<div>'
      +'<div class="col-xs-12 no-padding">'
      +'<div class="msg pull-right">'+msg+'</div>'
      +'</div>'
      +'</div>';

    $('.chat-list').append(html);

    this.appendUser(this.data.info.name, this.data.info.avatr, this.data.info.fd);
    this.scrollBottom();

    text.val('');
  },
  newMessage : function(data) {
    this.appendUser(data.user.name, data.user.avatar, data.user.fd);
    var html = '<div class="col-xs-10 msg-item ">'
      +'<div class="col-xs-1 no-padding">'
      +'<div class="avatar">'
      +'<img src="'+data.user.avatar+'" width="50" height="50" class="img-circle">'
      +'</div>'
      +'</div>'

      +'<div class="col-xs-11 no-padding">'
      +'<div class="col-xs-12">'
      +'<div class="username">'+data.user.name+'</div>'
      +'</div>'
      +'<div class="col-xs-12 no-padding">'
      +'<div class="msg">'+data.message+'</div>'
      +'</div>'
      +'</div>'
      +'</div>';

    $('.chat-list').append(html);
    this.scrollBottom();
  },
  scrollBottom : function() {
    $('.chat-list').scrollTop($('.chat-list')[0].scrollHeight );
  },
  notice : function(msg) {
    var html ='<div class="col-xs-12 notice text-center">'+msg+'</div>';
    $('.chat-list').append(html);

    this.scrollBottom();
  },
  appendUser : function(name, avatar, fd) {
    if ($(".fd-"+fd).length > 0) {
      return true;
    }
    var html = ' <div class="user-item fd-'+fd+'">'
      +'<div class="avatar">'
      +'<img src="'+avatar+'" width="50" height="50" class="img-circle">'
      +'</div>'
      +'<div class="user-name">'+name+'</div>'
      +'</div>';

    $(".user-list").append(html);
    $('.user-list').scrollTop($('.user-list')[0].scrollHeight );
  },
  layerSuccessMsg : function(msg) {
    layer.msg(msg, {time: 1000, icon:6});
  },
  layerErrorMsg : function(msg) {
    layer.msg(msg, {time: 1000, icon:5});
  }
};