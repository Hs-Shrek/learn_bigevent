// -----------------------进入页面判断token---------------------
// 1.判断是否有token
if (localStorage.getItem("token") == null) {
  location.href = "../login.html";
}


// -----------------------用户的基本信息---------------------
// 1.获取用户的基本数据
$.ajax({
  type: "get", //不写type默认是get
  url: "http://ajax.frontend.itheima.net/my/userinfo",

  // 设置请求头
  // 请求头里面放的是token信息，用于验证用户身份
  headers: {
    // token已经存在本地了，可以直接获取本地token信息
    Authorization: localStorage.getItem("token")
  },
  // success只有请求成功后会调用
  // res是响应的数据
  success: function (res) {
    if (res.status == 0) {
      // 名称，有昵称就设置昵称，没有就就用户名
      var name = res.data.nickname || res.data.username;
      $(".username").text(name);

      // 头像，有图片使用图片，没有就用名称的首字母
      //    如果有图片
      if (res.data.user_pic != undefined) {
        $(".layui-nav-img").show().prop("src", res.data.user_pic);
        $(".avatar").hide();
      } else {
        // 截取名称的第一个字符
        // 英文字符的小写变成大写
        // 字符串.toUpperCase()
        var first_name = name.substr(0, 1).toUpperCase();

        // 显示
        $(".avatar").show().css("display", "inline-block").text(first_name);
        $(".layui-nav-img").hide();
      }
    }
  },
  // fail是请求失败的时候调用
  fail:function () {  },
  // complete不管请求是否成功都会执行调用
  // xhr是一个JQ封装后的xhr对象
  complete: function (xhr) { 
    // xhr.responseJSON  就是返回的数据
    if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
        
      // 删除 过期 token
      localStorage.removeItem('token');
      // 跳转到登录页面
      location.href = '/login.html';
  }
   }
});

// -----------------------退出按钮功能---------------------
// - 点击退出按钮，询问用户确认要退出；
// - 点击确定，返回登录页，清空token值；
$("#logout").on("click", function () {
  //  layui弹出层，确认是否退出
  layer.confirm("确认是否退出", { icon: 3, title: "退出当前页面" }, function (index) {
    // index-当前窗口的ID值，用于关闭窗口
    // 如果点击了确定，删除token，页面跳转
    localStorage.removeItem("token"); //清除指定名称的本地内容
    location.href = "../login.html";
    layer.close(index); // 关闭当前弹出层
  });
});
