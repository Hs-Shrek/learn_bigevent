// 公共的JS，便于后期维护
//    例如：
//       1.放入公共域名根路径， 单独模块写接口地址即可
//       2./my接口 都需要token验证，  可以token放入公共JS 不用每个都写
//       3.所有/my接口 都需要在complete 的时候验证token身份的有效性

//  需求：
//    设置根路径
//    配置请求头
//    complete验证token有效性

// $.ajaxPrefilter(function (option) {})  ajax提前过滤
$.ajaxPrefilter(function (data) {
  // option 是每次发送ajax请求之前，拿到的ajax即将传入的配置项
  // 根路径
  var base = "http://ajax.frontend.itheima.net";
  data.url = base + data.url;

  // /my 路径 请求头
  // .includes判读是否包含指定的路径
  if (data.url.includes("/my/") != -1) {
    data.headers = {
      Authorization: localStorage.getItem("token")
    };

    // 验证token是否有效
    data.complete = function (xhr) {
      // xhr.responseJSON  就是返回的数据
      if (xhr.responseJSON.status === 1 || xhr.responseJSON.message === "身份认证失败！") {
        // 删除 过期 token
        localStorage.removeItem("token");
        // 跳转到登录页面
        location.href = "/login.html";
      }
    };
  }
});
