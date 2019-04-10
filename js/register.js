$(function () {
  //验证码验证
  $('#pyg_code').on('tap',function () {
    
    //获取手机号
    var mobile = $('[name="mobile"]').val()
    //正则验证手机号码
    var reg = /^1[3-9]\d{9}$/
    //判断手机号码是否符合规范
    if (!reg.test(mobile)) {
      MutationEvent.toast('手机号码不符合规范')
      return false
    }
    //发送请求
    $.ajax({
      type: 'post',
      url: 'users/get_reg_code',
      data: {
        mobile: mobile
      },
      dataType: 'json',
      success: function (result) {
        // console.log(result);
        //验证通过
        if (result.meta.status == 200) {
          //赋值验证码
          $('[name="code"]').val(result.data)
        }
      }
    })
  })

  //实现注册
  $('.btn-register').on('tap',function () {
    //声明个变量接收form表单内的值,serialize方法
    var allval = $('form').serialize()
    console.log(allval);
    $.ajax({
      type:'post',
      url: 'users/reg',
      data:allval,
      dataType:'json',
      success:function (result) {
        console.log(result);
        if (result.meta.status==200) {
          mui.toast('注册成功')
          setTimeout(() => {
            //延迟1s跳转到登陆界面
            location.href='./login.html'
          }, 1000);
        }
      }
    })
  })
})