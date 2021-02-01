// 新密码长度要求6-12
// 两次输入的新密码必须一样
// 新密码不能和旧密码一样

// ------------------------------------------------------验证密码环节
var form = layui.form;
form.verify({
  // 两种书写方式

  // 规则名：[正则、不符合正则的提醒信息]
  //密码长度的限制
  changdu: [/^\S{6,12}$/, "输入的密码不符合要求"],

  // 规则名：函数，return 不符合正则的提醒信息
  same: function (val) {
    // 再次输入的val值 和 第一次输入的val 值进行判断
    if ($(".newPwd").val() !== val) {
      return "两次输入的密码不一致";
    }
  },

  // 新密码和旧密码不能一样
  diff: function (val) {
    if ($(".oldPwd").val() == val) {
      return "新密码和旧密码不能相同";
    }
  }
});

// ------------------------------------------------------提交
$("form").on("submit", function (e) {
  e.preventDefault();

  // 收集数据  只要是input框都能被收集
  // 再次输入新密码不需要被收集
  // 1.设置input 的 disabled   但是会关闭输入功能
  // 2.无name设置

  var data = $(this).serialize();

  $.ajax({
    type: "post",
    url: "/my/updatepwd",
    data: data,
    success: function (res) {
      layer.msg(res.message);
      if (res.status === 0) {
        // 修改成功，清空输入框的值
        $("form")[0].reset(); // DOM方法reset表示重置表单
      }
    }
  });
});
