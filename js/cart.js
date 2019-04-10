$(function () {
      //初始化滚动
      mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false //是否显示滚动条，默认为True
      });
      function init() {
        //请求数据
        $.ajax({
          type: 'get',
          url: 'my/cart/all',
          dataType: 'json',
          success: function (result) {
            console.log(result);
            //在打印出结果时，发现只需要cart_info
            console.log(result.data.cart_info);
            //获取data.cart_info,转成字符串
            var data = JSON.parse(result.data.cart_info)
            //动态生成
            var html = template('orderListTemp', {
              list: data
            })
            $('.pyg_order').html(html)
            //动态生成数字输入框，要想使用需要初始化
            mui('.pyg_userNum').numbox()
            //发送请求时调用总金额函数
            allPrice();
            // console.log(4444);
          }
        })
      }
      init();
      //单机编辑按钮 左按钮删除 右按钮完成 购物车页面一开始 复选框为隐藏状态 点击时显示
      $('.pyg-orderEdit').on('tap', function () {
        //切换样式
        $('body').toggleClass('toggleEdit')
        //修改编辑按钮
        if ($(this).text() == '编辑') {
          //修改成完成
          $(this).text('完成')
        } else {

          $(this).text('编辑')
          //调用函数syncCart，将用户编辑的信息更新到数据库 传入参数
          syncCart($('.orderlist'))
        }
      })
      //
      function syncCart(allList) {
        //声明个空数组 存放收集到的数据
        var list_obj = {}
        //循环
        for (var i = 0; i < allList.length; i++) {
          //因为不能从ajax请求里面拿数据 所以在模板里面设置自定义样式存储当前编辑的数据 jQuery获取自定义属性data-order的属性值便是data('order)
          var data = $(allList[i]).data('order')
          console.log(data);

          //获取用户编辑后的数量
          data.amount = $(allList[i]).find('#test').val()
          //赋值键值对
          list_obj[data.goods_id] = data
        }
        //  console.log(list_obj);
        //同步更新，发送ajax请求
        $.ajax({
          type: 'post',
          url: 'my/cart/sync',

          data: {
            'infos': JSON.stringify(list_obj)
          },
          success: function (result) {
            // console.log(result);
            init()
          }
        })
      }
      var total;
      //当前总金额的计算
      function allPrice() {
        //声明变量接收总总价格
         total= 0
        //获取所有商品
        var allOrders = $('.orderlist')
        //JQuery里面的each循环
        allOrders.each(function (index, value) {
          //打印出所有商品
          console.log(value);
          //获取价格
          var price = $(value).data('order').goods_price
          console.log(price);
          //获取商品数量,由于商品数量不是固定，而用户增加/减少数量，总价格也需要同时进行计算同一时间渲染到页面，所以采用获取当前数字输入框的值方式来进行获取商品数量
          var num = $(value).find('#test').val()
          console.log(num);
          //计算总价 件*商品
          total = total + (price * num)
          console.log(total);
          
        })
        //赋值到页面
        $('.total_price').text('￥' + total)
      }
        //点击数字输入框 重新计算总价格 事件委托 增/减按钮
        $('.orderlist').on('tap', '.pyg_userNum .mui - btn', function () {
          //再调用一次
          allPrice();
        })
      //单击删除按钮，实现删除功能效果
      $('.pyg_orderDel').on('tap',function () {
        //提交没被选中的列表
        var list = $('.pyg_order').find("[type='checked']").not(':checked').parents('.orderlist')
        syncCart(list)
        init()
       })
     //点击生成订单按钮，生成订单页面
     $('.orderform').on('tap','a',function () {
       //参数
       var order = {
         'order_price':total,
         'consignee_addr': $('.ares').text(),
         'goods':[]
       }
       //声明个变量存储模板内的数据
       var allOrders = $('.orderlist')
       //循环遍历
       allOrders.each(function (index,value) {
         var singer = {}
         //获取模板数据
         var temp = $(value).data('order')
         //赋值
         singer.goods_id=temp.goods_id
         singer.goods_number=temp.amount
         singer.goods_price = temp.goods_price
         //追加到goods中
         order.goods.push(singer)
       })
       console.log(order);
       //发送ajax请求
       $.ajax({
         type:'post',
         url: 'my/orders/create',
         data:order,
         dataType:'json',
         success:function (result) {
           console.log(result);
           location.href='./orderlist.html'
         }
       })
     })
      })