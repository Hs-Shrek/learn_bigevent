// ----------------------------获取用户输入的信息-----------------------
var form = layui.form;
get_info();

function get_info() {
  $.ajax({
    type: "get",
    url: "/my/userinfo",
    success: function (res) {
      layer.msg(res.message);
      if (res.status == 0) {
        // 获取的数据赋值输入框
        // $("input[name='username']").val(res.data.username);
        // $("input[name='nickname']").val(res.data.nickname);
        // $("input[name='email']").val(res.data.email);

        // 快速赋值方法 layui方法
        // user是在HTML结构自定的一个名称。layui的高效赋值方法
        form.val("user", res.data);
      }
    }
  });
}

// -------------------------点击提交——修改用户信息-----------------------
$("form").on("submit", function (e) {
  // 阻止默认行为
  e.preventDefault();
  // 获取id、nickname、email的值
  var data = $(this).serialize();
  // console.log(data);
  // ajax提交给接口，从而完成更新
  $.ajax({
    type: "POST",
    url: "/my/userinfo",
    data: data,
    success: function (res) {
      // 无论成功还是失败，都要提示
      layer.msg(res.message);
      if (res.status == 0) {
        // 需要回到index页面，对获取信息的方法进行封装！
        // 在index页面封装了获取显示信息的函数
        // 但是在userInfo页面无法调用该函数
        // 父级页面调用，Windows.parent找到index页面
        window.parent.get_info();
      }
    }
  });
});

// -------------------------点击重置——修改用户信息-----------------------
// 点击重置按钮的默认行为是清空页面中的所有数据，包括账户信息
// 应该为点击重置，显示的是之前的数据
$(".btn-reset").click(function (e) {
  e.preventDefault();

  //  为表单重新赋值，请求原来的数据
  //  把获取用户数据重新获取；
  get_info();
});
