// ----------------------------------------------------------切换
$("#goto-register").on("click", function() {
  // $("#login").hide();
  $("#register").show();
});
$("#goto-login").on("click", function() {
  // $("#login").show();
  $("#register").hide();
});








// -----------------------------------------------------------注册
// 验证：记录下来；提高开发效果；
var form = layui.form;
form.verify({
  // 规则名：[正则、不符合正则提醒信息]
  changdu: [/^\S{6,12}$/, "不满足长度要求"],


  // 规则名：函数，必须 有return  不符合正则提醒信息
  same: function(val) {
    // 第一输入：直接获取；HTML结构上做一些简单类名补充，方便获取值
    // 再次输入：val

    if ($(".pwd").val() != val) {
      return "两次输入的密码不一致";
    }
  }
});

$("#register .layui-form").on("submit", function(e) {
  // 1.阻止默认行为；
  e.preventDefault();


  // 2.收集数据
  var data = $(this).serialize();

  // 3.接口，发出请求
  // 发生数据
  $.ajax({
    type: 'POST',
    url: 'http://ajax.frontend.itheima.net/api/reguser',
    data: data,
    success: function(res) {
      // 弹窗：msg 简单弹窗、会自动消失；
      layer.msg(res.message);

      // 业务设计：
      if (res.status == 0) {
        $("#register").hide();
        $("#login").show();

        // 需求：原生方式；重置！
        //       注意慎重使用this;
        $("#register .layui-form")[0].reset();
      }
    }
  });



});




// -----------------------------------------------------------登录
$("#login .layui-form").on("submit", function(e) {
  // 1.阻止默认行为；
  e.preventDefault();


  // 2.收集数据
  var data = $(this).serialize();

  // 3.接口，发出请求
  // 发生数据
  $.ajax({
    type: 'POST',
    url: 'http://ajax.frontend.itheima.net/api/login',
    data: data,
    success: function(res) {
      // 弹窗：msg 简单弹窗、会自动消失；
      layer.msg(res.message);

      if (res.status == 0) {
        // 把token保存到本地存储
        localStorage.setItem('token', res.token);

        // 
        location.href = "/index.html";
      }
    }
  });



});