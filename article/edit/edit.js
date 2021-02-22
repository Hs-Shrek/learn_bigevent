// 1.获取list界面传入的id值
var str = window.location.search; // 获取的 str = ?id=12345
var id = str.slice(4); //截取出id值

// 2.获取id对应的文章的内容数据
//    初始化 ： 富文本 图片区 下拉选择框
var form = layui.form;
// 2.1 下拉列表
$.ajax({
  url: "/my/article/cates",
  success: function (res) {
    if (res.status == 0) {
      var str = `<option value="">所有分类</option>`;
      $.each(res.data, function (index, ele) {
        str += `<option value="${ele.Id}">${ele.name}</option>`;
      });
      $("select").html(str);

      // 渲染
      form.render("select");

      get();
    }
  }
});

// 2.2 富文本
initEditor();

// 2.3 图片区
$("#image").cropper({
  // 宽高比例
  aspectRatio: 400 / 280,
  // 预览区容器的类名
  preview: ".img-preview"
});
$('button:contains("选择封面")').click(function () {
  $("#file").click();
});
// 文件域的内容改变的时候，更换剪裁区的图片
$("#file").change(function () {
  // 3.1) 先找到文件对象
  var fileObj = this.files[0];

  // 3.2) 为选择的图片生成一个临时的url
  var url = URL.createObjectURL(fileObj);
  $("#image").cropper("replace", url);
});

//  2.4   获取这篇文章的内容 ， 展示出来
function get() {
  $.ajax({
    url: '/my/article/' + id,
    success: function(res) {
      if (res.status === 0) {
        // 使用layui的form模块中的 val 方法 快速为表单赋值（数据回填）
        form.val('edit', res.data);
        // --------------------  内容区更换为富文本编辑器

        $('#image').cropper("replace", 'http://ajax.frontend.itheima.net' + res.data.cover_img);
      }
    }
  });
}



// 更新文章内容
$('form').on('submit', function(e) {
  var index = layer.load(2, { shade: [0.8, '#393D49'] })
  e.preventDefault();

  // 收集表单数据
  var fd = new FormData(this);


  // 替换FormData对象里面的一项
  fd.set('content', tinyMCE.activeEditor.getContent());
  fd.append('Id', id);

  // 剪裁图片
  var canvas = $('#image').cropper('getCroppedCanvas', {
    width: 400,
    height: 280
  });
  // // 把图片转成 blob 形式
  canvas.toBlob(function(blob) {
    // 形参 blob 就是转换后的结果

    // 把 文件 追加到fd中
    fd.append('cover_img', blob);
    // 遍历fd对象，检查一下fd对象中是否包括了接口要求的5个参数
    // fd.forEach((value, key) => {
    //   console.log(key, value)
    // })

    // ajax提交给接口，从而完成添加
    $.ajax({
      type: 'POST',
      url: '/my/article/edit',
      data: fd,
      // 提交formdata数据，必须加下面两个选项
      processData: false,
      contentType: false,
      success: function(res) {
        // console.log(res);
        layer.msg(res.message);
        if (res.status === 0) {
          location.href = '/article/list/list.html';

          layer.close(index);
        }
      }
    });
  });

});