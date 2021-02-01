// -------------------------------  创建剪裁区
// - 调用cropper方法，创建剪裁区
$("#image").cropper({
  // 纵横比(宽高比)
  aspectRatio: 1, // 正方形
  // 指定预览区域
  preview: ".img-preview" // 指定预览区的类名（选择器）
});

// -------------------------------  从本地上传图片
// 设置一个隐藏的文本域，作用是弹出选择文件的窗口
// <input type="file" id="file" style="display: none;">

// 1. 点击按钮  选择图片，弹出这个隐藏的文本域,用来选择图片
$(".select").on("click", function () {
  $("#file").click();
});

// 2.  选择一个图片  注册change事件
//  change事件，文件被选择的时候会执行
//  选择图片后，上方的实例图片应该改变，
//    1.获取到文件的信息的对象，需要图片的src地址
//    2.内置对象  URL.createObjectUR(fileobj图片的文件对象)
//    3.不能直接替换img的文件地址，因为原本的img被 cropper包装了，需要看文档修改
$("#file").change(function () {
  // 1.获取文件对象
  var fileobj = this.files[0];
  // 2.创建临时地址
  var url = URL.createObjectURL(fileobj);
  // 3.替换原本的cropper的图片
  $("#image").cropper("replace", url);
});

// -------------------------------  确定 - cropper剪裁 - 提交
// 点击确定,把图片转换为base64格式，ajax提交字符串，完成更换
$(".determine").on("click", function () {
  // 1.使用cropper插件的方法得到一个canvas对象
  var canvas = $("#image").cropper("getCroppedCanvas", {
    width: 100,
    height: 100
  });

  // 2. canvas 把剪裁出来的图片信息 通过toDataURL方法转为 base64字符串
  var base64 = canvas.toDataURL("image/png");

  // 3. 提交请求
  $.ajax({
    type: "post",
    url: "/my/update/avatar",
    data: { avatar: base64 },
    success: function (res) {
      layer.msg(res.message);
      if (res.status === 0) {
        // 重新渲染父页面的头像
        window.parent.get_info();
      }
    }
  });
});
