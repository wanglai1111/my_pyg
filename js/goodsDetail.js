$(function () {
  //初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });
  //声明个全局变量
  var info ={
      cat_id:'',
      goods_id:'',
      goods_name:'',
      goods_number:'',
      goods_price:'',
      goods_small_logo:'',
      goods_weight:''
  }
 //发送请求
 $.ajax({
   type:'get',
   url: 'goods/detail',
   data: $.getParameter(location.search),
   dataType:'json',
   success:function (result) {
     console.log(result);
      //赋值给info
        info.cat_id= 'result.cat_id'
        info.goods_id= 'result.goods_id'
        info.goods_name= 'result.goods_name'
        info.goods_number= 'result.goods_number'
        info.goods_price='result.goods_price'
        info.goods_small_logo= 'result.goods_small_logo'
        info.goods_weight= 'result.goods_weight'
        var html = template('sliderTemp', result.data)
        console.log(html);
        //动态生成结构
        $('.mui-scroll').html(html)
         mui('.mui-slider').slider({
           interval: 2000
         });
   }
 })


})