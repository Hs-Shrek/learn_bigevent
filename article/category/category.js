// ----------------------------列表获取
getList();
function getList() {
  $.ajax({
    type: "get",
    url: "/my/article/cates",
    success: function (res) {
      if (res.status == 0) {
        var str = "";
        // 遍历数据 ， 拼接字符串 ， 添加到HTML
        $.each(res.data, function (index, ele) {
          str += `<tr>
                     <td>${ele.name}</td>
                     <td>${ele.alias}</td>
                     <td>
                        <button myid="${ele.Id}" data-name="${ele.name}" data-alias="${ele.alias}" type="button" class="layui-btn layui-btn-xs edit">编辑</button>
                        <button myid="${ele.Id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger delete">删除</button>
                     </td>
                   </tr>`;
        });
        $("tbody").html(str);
      }
    }
  });
}

// ----------------------------新增分类
// 设置add模板字符串
var add_str = `
  <form class="layui-form add-form" action="" style="margin: 30px; margin-left: 0px;" id="add_form">
    <div class="layui-form-item">
      <label class="layui-form-label">类别名称</label>
      <div class="layui-input-block">
        <input type="text" name="name" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">类别别名</label>
      <div class="layui-input-block">
        <input type="text" name="alias" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-input-block">
        <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
      </div>
    </div>
  </form>`;
// 点击添加类别，出现layui弹窗
$(".add").on("click", function (e) {
  // 1.弹窗 layer.open({})
  layer.open({
    type: 1,
    title: "新增类别",
    // add_str在外面提前设置，方便维护
    content: add_str,
    area: ["500px", "250px"],
    // 当层创建完毕的时候   执行layui的success   参数1：当前层的DOM，参数2：当前层的索引
    success: function (dom, index) {
      // index:是一个number值，用来关闭layer

      // 解决了 问题 1 的方案，但是会导致代码的冗余、复杂
      // $("#add_form").on("submit", function(e) {
      //   e.preventDefault();
      // })

      // 解决 问题 2  封装起来
      add_sub(index); // 封装函数需要调用index  所以从这里传入，封装的函数可以直接调用
    }
  });
});

// 问题 1 ：
// 直接在后面注册点击事件，由于 add_form 还未添加到HTML 结构中，所以无法阻止默认行为
// 由于注册点击事件是异步代码，但是后面函数的执行是异步的，所以只有点击了 add  才会有  add_form 出现

// 解决： 等form出来了之后，才能获取，注册事件
//       layer.open(success里去注册提交事件)

// $("#add_form").on("submit", function(e) {
//   e.preventDefault();
// })

// 问题 2 ： 直接写入会导致代码的冗余
// 解决 ： 封装 , 传入把index当做形参传入
function add_sub(index) {
  $("#add_form").on("submit", function (e) {
    e.preventDefault();

    // 收集数据
    var data = $(this).serialize();

    // 提交请求
    $.ajax({
      type: "post",
      url: "/my/article/addcates",
      data: data,
      success: function (res) {
        layer.msg(res.message);
        if (res.status == 0) {
          getList();
          layer.close(index);
        }
      }
    });
  });
}
