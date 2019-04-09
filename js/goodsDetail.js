$(function () {
  //初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });
  //声明个全局变量
  var info = {
    cat_id: '',
    goods_id: '',
    goods_name: '',
    goods_number: '',
    goods_price: '',
    goods_small_logo: '',
    goods_weight: ''
  }
  //发送请求
  $.ajax({
    type: 'get',
    url: 'goods/detail',
    data: $.getParameter(location.search),
    dataType: 'json',
    success: function (result) {
      console.log(result);
      //赋值给info
      info.cat_id = 'result.cat_id'
      info.goods_id = 'result.goods_id'
      info.goods_name = 'result.goods_name'
      info.goods_number = 'result.goods_number'
      info.goods_price = 'result.goods_price'
      info.goods_small_logo = 'result.goods_small_logo'
      info.goods_weight = 'result.goods_weight'
      var html = template('sliderTemp', result.data)
      console.log(html);
      //动态生成结构
      $('.mui-scroll').html(html)
      mui('.mui-slider').slider({
        interval: 2000
      });
    }
  })
//点击购物车按钮 添加商品到购物车
 $('.btn-addCart').on('tap',function(){
   console.log(111);
   //声明个变量存储数据 采用临时存储对象sessionStorage存储
   var mytoken = sessionStorage.getItem('pyg_token')
   console.log(mytoken);
   //用户操作界面成功一次就存在token，如果没有token 需要登陆
   if (!mytoken) {
     //登陆
     location.href ='./login.html?redirectUrl='+escape(location.href)
     //否则 不需要登陆 直接发送请求 从存储对象中获取数据
   }else{
     $.ajax({
       type:'post',
       url:'my/cart/add',
       data:JSON.stringify(info),
       dataType:'json',
       success:function (result) {
         //整个间隔时间如果太长需要重新登陆
         if (result.meta.status == 401) {
            location.href = './login.html?redirectUrl=' + escape(location.href)
         }else{
           //否则出现提示成功;
           alert('ok')
           
           
         }
       }
     })
   }
 })
})