// ------------------------注册按钮 - 功能---------------------------
// 1.点击 去注册账号 ，登录框隐藏，注册框显示
$("#goto-register").on("click", function () {
  $("#login").hide();
  $("#register").show();
});
// 2.点击 已有账号去登录 注册框隐藏，登录框显示
$("#goto-login").on("click", function () {
  $("#register").hide();
  $("#login").show();
});

// ------------------------注册模块---------------------------

// ---------------重要--layUI进行帐号密码的验证-------------------
var form = layui.form;
form.verify({
  // 两种书写方式

  // 规则名：[正则、不符合正则的提醒信息]
  changdu: [/^\S{6,12}$/, "输入的密码不符合要求"],
  //密码长度的限制

  // 规则名：函数，return 不符合正则的提醒信息
  same: function (val) {
    // 再次输入的val值 和 第一次输入的val 值进行判断
    if ($(".layui-input").eq(3).val() !== val) {
      return "两次输入的密码不一致";
    }
  }
});

// 检查 注册按钮的类型，是否会触发默认事件，选择对应的模块进行注册事件
// 给表单注册
$("#register .layui-form").on("submit", function (e) {
  // 阻止默认行为
  e.preventDefault();

  // 收集数据
  var params = $(this).serialize();

  // 对收集到的数据进行验证
  // 需求：
  //    1.用户名，密码，重复密码不能为空 ---required
  //    2.密码和重复密码长度 6~12位，不能出现空格， 要匹配非空字符 \S
  //    3.密码和重复密码必须一致
  // 实现： layui 自定义的正则验证方式，在html标签的 lay-verify 中添加自定义的名称

  // 发出请求
  $.ajax({
    type: "post",
    url: "http://ajax.frontend.itheima.net/api/reguser",
    data: params,
    success: function (res) {
      // res.message是注册是否成功返回的信息
      layer.msg(res.message);
      if (res.status == 0) {
        // 注册成功，显示 登录盒子 隐藏 注册盒子
        $("#register").hide();
        $("#login").show();
        // 清空注册表单
        //  注意：
        //      1.此处使用$(this) ，会报错，和上方的this并不是同一个指向
        //      2.如果使用 that 代替，会构成闭包，每提交一次就会构成一次闭包
        $("#register .layui-form")[0].reset();
      }
    }
  });
});

// ------------------------登录模块---------------------------
// $("#login .layui-form").on("sumbit", function (e) {
//   e.preventDefault();
//   // 收集账号、密码
//   var params = $(this).serialize();

//   $.ajax({
//     type: "post",
//     url: "http://ajax.frontend.itheima.net/api/login",
//     data: params,
//     success: function (res) {
//       layer.msg(res.message);

//       if (res.status == 0) {
//         // 把token保存到本地存储
//         // token  身份认证
//         localStorage.setItem("token", res.token);
//         // 跳转到index.html
//         location.href = "../index.html";
//       }
//     }
//   });
// });

$("#login .layui-form").on("submit", function (e) {
  // 1.阻止默认行为；
  e.preventDefault();

  // 2.收集数据
  var data = $(this).serialize();

  // 3.接口，发出请求
  // 发生数据
  $.ajax({
    type: "POST",
    url: "http://ajax.frontend.itheima.net/api/login",
    data: data,
    success: function (res) {
      // 弹窗：msg 简单弹窗、会自动消失；
      layer.msg(res.message);

      if (res.status == 0) {
        // 把token保存到本地存储
        localStorage.setItem("token", res.token);

        //
        location.href = "../index.html";
      }
    }
  });
});
