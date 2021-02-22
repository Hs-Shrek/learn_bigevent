// ---------------------------------------加载分类数据
var form = layui.form;
var laypage = layui.laypage;
var data = {
  pagenum: 1, //当前是第几页的数据
  pagesize: 2 //每页显示几条数据
};
$.ajax({
  url: "/my/article/cates",
  success: function (res) {
    if (res.status == 0) {
      var str = `<option value="">所有分类</option>`;
      $.each(res.data, function (index, ele) {
        str += `<option value="${ele.Id}">${ele.name}</option>`;
      });
      $("select").eq(0).html(str);
      form.render("select"); // 重新创建div结构
    }
  }
});

// ---------------------------------------获取文章列表
get_list();
function get_list() {
  $.ajax({
    type: "get",
    url: "/my/article/list",
    data: data, //提前把数据在全局声明，因为在下面的分页器还需要调用这些数据
    //    {
    //   pagenum: 1, //当前是第几页的数据
    //   pagesize: 3 //每页显示几条数据
    // },
    success: function (res) {
      if (res.status == 0) {
        var str = "";
        $.each(res.data, function (index, ele) {
          str += `<tr>
                    <td>${ele.title}</td>
                    <td>${ele.cate_name}</td>
                    <td>${ele.pub_date.slice(0, ele.pub_date.length - 4)}</td>
                    <td>${ele.state}</td>
                    <th>
                      <!-- 编辑按钮 -->
                      <a href="/article/edit/edit.html?id=${ele.Id}" class="layui-btn layui-btn-xs">编辑</a>
                      <!-- 删除按钮 -->
                      <button delid="${ele.Id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger del">删除</button>
                    </th>
                  </tr>`;
        });
        $("tbody").html(str);

        // 调用封装的分页功能  传入参数作为数据
        getPage(res.total); // res.total是获取到的数据总数，传入到封装的函数作为形参
      }
    }
  });
}

// ---------------------------------------分页功能模块
// layui 内置模块， 分页器功能
//  1.准备一个div id值    和  配置项  elem 的值一致
//  2.参数配置

// 分页功能应该放在获取文章列表功能的里面，提前封装然后调用
function getPage(total) {
  laypage.render({
    // 容器的id值；
    elem: "page",

    // 数据数目
    count: total, // 数据总数，服务器返回的数据

    // data在上方声明在全局，所以可以调用
    limit: data.pagesize, // 每页要显示的条数
    curr: data.pagenum, // 当前是第几页

    // 下拉框
    limits: [2, 3, 5, 10], // 下拉框的值，表示每页多少条，下拉框用于更换
    // 布局，分页器所出现的功能
    layout: ["prev", "page", "next", "count", "limit", "skip"],

    // 刷新页面 及 页码切换 的时候，会执行jump函数
    jump: function (obj, first) {
      // 点击 页码切换 ，页显示数据 改变的时候
      // 重新加载

      // first: jump第一次触发，first=true;  页面第一次打开
      // 除此之外,所有的触发，first = undefined
      // 此处的判断必须得写上
      if (first === undefined) {
        data.pagenum = obj.curr; // obj.curr 当前选择的页码
        data.pagesize = obj.limit; //obj.limit 当前选择的显示数据数目
        get_list();
      }
    }
  });
}

// ---------------------------------------筛选
// 点击筛选 拿到两个数据值
//    1. 分类值   2. 发布状态值
//   细致查询： 之前的data：{页码和容量}
//            现在的data：{页码，容量，分类，发布状态}
//    发出细致的参数请求  返回的数据是 筛选过后的结果 渲染出来
$(".search").on("submit", function (e) {
  e.preventDefault();
  //  收集数据 ，分类和状态
  // var parmas = $(this).serialize(); //获取的是ID和status的字符串

  var parmas = $(this).serializeArray(); //返回的是 数组对象，不能直接做参数传入

  //  把分类和状态设置到全局的data上 ，形成新的data
  data.cate_id = parmas[0].value;
  data.state = parmas[1].value;
  // 产品设计 ： 如果用户要查询分类，默认从第一页开始看
  data.pagenum = 1;

  // 调用
  get_list();
});

// ---------------------------------------删除
// 事件委托注册事件
$("tbody").on("click", ".del", function (e) {
  // 获取id值
  var id = $(e.target).attr("delid");

  // 询问是否删除
  layer.confirm("是否要删除？", function (index) {
    // 请求删除
    $.ajax({
      url: "/my/article/delete/" + id,
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          get_list();
          layer.close(index);
        }
      }
    });
  });
});
