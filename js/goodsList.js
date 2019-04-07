$(function () {
  //单机搜索实现侧滑效果
  $('.mui-icon-search').on('tap', () => {
    //调用
    mui('.mui-off-canvas-wrap').offCanvas('show');
  })
  // 数据用对象的形式
  var data = {
    cid: getParameter(location.search).cid,
    pagenum: 1,
    pagesize: 10
  }
  // 刷新和加载都要用到ajax请求，所有进行封装
  function renderData(callback, obj) {
    $.ajax({
      type: 'get',
      url: 'goods/search',
      //采用$.extend方法 将令一个对象里面的内容添加到要添加的对象中
      data: $.extend(data, obj),
      dataType: 'json',
      
      success: function (result) {
        console.log(result);
        //接收传过来的数据
        callback(result)
      }
    })

  }
  //下拉刷新、上拉加载
  mui.init({
    swipeBack: false,
    pullRefresh: {
      container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        height: 50, //可选,默认50.触发下拉刷新拖动距离,
        auto: true, //可选,默认false.首次加载自动下拉刷新一次
        contentdown: "下拉可以刷新",
        contentover: "释放立即刷新",
        contentrefresh: "正在刷新...",
        // 下面这个回调函数在下拉松开手指之后会触发
        callback: function () { //必选，刷新函数
          // console.log(123);

          data.pagenum = 1;
          // console.log(data);
          console.log(renderData);

          renderData(function (result) {
            console.log(123333);
            var html = template('goodlistTemp', result.data)
            // console.log(html);

            $('.goodslist').html(html)
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            // 为了防止切换分类的时候，无法再上拉，所以在每次刷新的时候将上拉加载重新启用
            mui('#refreshContainer').pullRefresh().refresh(true)

          });


        }
      },
      up: {
        height: 50, //可选,默认50.触发下拉刷新拖动距离,
        auto: false, //可选,默认false.首次加载自动下拉刷新一次
        contentrefresh: "正在加载...",
        contentnomore: "没有更多数据了",
        // 下面这个回调函数在下拉松开手指之后会触发
        callback: function () { //必选，刷新函数
          data.pagenum++
          renderData(function (result) {
            //如果数据极少 则需要判断 是否已加载完全部
            if (result.data.goods.length > 0) {
              var html = template('goodlistTemp', result.data)
               $('.goodslist').append(html)
              mui('#refreshContainer').pullRefresh().endPullupToRefresh();
            } else {
              mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
            }
          })
        }
      }
    }
  });
  //发送请求时，拿到url地址栏里面的属性及其属性值
  function getParameter(url) {
    //声明最初对象变量Obj
    var obj = {}
    //不需要?号 所有
    url = url.substring(1)
    //例如name=rose&cid=5参数
    //去除&
    var arr = url.split('&')
    //遍历数组
    for (var i = 0; i < arr.length; i++) {
      //获取遍历到每个对象,去除=
      var temp = arr[i].split('=')
      //赋值给空对象obj
      obj[temp[0]] = temp[1]
    }
    return obj
  }
  //给搜索按钮添加点击事件
  $('.query_btn').on('tap', function () {
    var obj = {}
    //赋值
    obj.query = $('.query_txt').val()
    renderData(function (result) {
      var html = template('searchListTemp', result.data)
      $('.searchList').html(html)
    }, obj)
  })
})