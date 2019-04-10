$(function () {
  //为确认按钮添加点击事件，点击触发事件 收集用户数据
  $('.mui-btn-primary').on('tap',function () {
    //声明个变量收集用户数据
    var obj ={
      username:'',
      password:''
    }
    //获取手机号码和密码并赋值
    obj.username = $('.username').val()
    obj.password = $('.password').val()
    //正则验证手机号码
    if (!/^1[3-9]\d{9}$/.test(obj.username)) {
      //号码不符合则出现提示消息框
      mui.toast('手机号码输入不正确')
      return false
    }
    //密码验证
    if (obj.password.length<6) {
      mui.toast('请输入正确的密码')
      return false
    }
    //发送ajax请求，根基token跳转页面
    // console.log(obj);
    
    $.ajax({
      type:'post',
      url:'login',
      data:obj,
      dataType:'json',
      success:function (result) {
        console.log(result);
        //如果登入成功
        if (result.meta.status == 200) {

          //存储当前token
          sessionStorage.setItem('pyg_token', result.data.token)
          //对url进行编码
          var re = $.getParameter(location.search).redirectUrl
          //判断是否跳转
          if (re) {
            //满足条件 则对url进行解码
            location.href = unescape(re)
          }else{
            location.href='/index.html'
          }
          //登入失败
        }else{
           mui.toast(result.meta.msg)
        }
      }
    })
  })
})