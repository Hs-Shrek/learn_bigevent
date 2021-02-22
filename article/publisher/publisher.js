//  ----------------------------------加载分类的数据
// 在发布之前，应该先加载出来 类别管理中的 分类数据，  用于发布时候的选择
var form = layui.form;
$.ajax({
  url: "/my/article/cates",
  success: function (res) {
    if (res.status == 0) {
      var str = "";
      // 获取数据，拼接格式
      $.each(res.data, function (index, ele) {
        str += `<option value="${ele.Id}">${ele.name}</option>`;
      });
      // 获取的数据添加到HTML结构中
      $("select").html(str);
      // 重新初始化 HTML 结构
      form.render("select");
    }
  }
});

// -----------------------------------富文本区域
// 直接调用，之前提前写好的初始化的富文本
// tinymce_setup.js
initEditor();

// -----------------------------------选择图片区域
// 裁剪区
$("#image").cropper({
  // 宽高比例
  aspectRatio: 400 / 280,
  // 预览区容器的类名
  preview: ".img-preview"
});

// 选择图片
$(".select").click(function () {
  $("#file").click();
});
// 弹窗，选择某个文件，file状态发生改变
$("#file").change(function () {
  // 3.1) 先找到文件对象
  var fileObj = this.files[0];

  // 3.2) 为选择的图片生成一个临时的url
  var url = URL.createObjectURL(fileObj);
  $("#image").cropper("replace", url);
});

// ----------------------------------发布功能
$("form").on("submit", function (e) {
  e.preventDefault();

  // 收集数据  formData()方法
  //      前提： 1 后台接口支持formData方式传数据
  //            2 必须有name的属性配置，和后台一致
  var fd = new FormData(this);

  // 遍历  可以看到后台已经添加了  哪些数据
  // $.each的函数参数 是   index  ， ele
  // foreach的参数是      ele   ,  index
  // fd.forEach(function (val, key) { }
  // console.log(val, key);

  //图片和富文本的内容没有获取到，有名无值，需要手动设置到fd里面
  // 查询富文本插件的文档，看如何获取
  fd.set("content", tinyMCE.activeEditor.getContent());

  // 裁剪后的图片信息，   cover_img : 值， 是”文件对象 “
  //    借助canvas插件  查文档 获取裁剪后的 文件对象  不是base64位字符串
  var canvas = $("#image").cropper("getCroppedCanvas", {
    width: 400,
    height: 280
  });
  //  canvas插件获取  裁剪文件对象
  canvas.toBlob(function (file) {
    fd.append("cover_img", file);

    // ---------formData方式信息收集完毕---------

    // 提交
    $.ajax({
      type: "post",
      url: "/my/article/add",
      data: fd,
      // 提交formdata数据，必须加下面两个选项
      //  默认提交的参数是会转化成字符串的形式，现在formData的形式 不需要转换
      processData: false,
      // 默认提交的参数类型，采用formData类型， 不用默认的类型
      contentType: false,
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          // 优化： 在文章发布成功后，页面应该跳转到 文章列表的页面，
          location.href = "../list/list.html";

          // 左边 导航栏 应该切换到文章列表部分，不应该还是在发表文章模块
          var wz_list = window.parent.document.querySelector("#wz_list");
          $(wz_list).addClass("layui-this").next().removeClass("layui-this");
        }
      }
    });
  });
});
