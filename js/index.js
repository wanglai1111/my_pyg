$(()=>{
 banner()
})

function banner() {
    $.ajax({
    type: 'get',
    url: 'home/swiperdata',
    dataType: 'json',
    success:result => { 
      //只有数据获取成功之后才会生成动态结构
      if (result.meta.status == 200) {
         console.log(result);
         //轮播图图片结构
         var html = template('bannerTemp',result)
         $('.pyg_indexBanner').html(html)
        //  console.log(html);
         
         //轮播图小圆点结构
         var indHtml = template('indicatorTemp',result)
         $('.pyg_indexIndicator').html(indHtml)
        //  console.log(indHtml);
        //添加轮播效果
         mui('.mui-slider').slider({
           interval:2000
         })
      }
    }
  })
}
