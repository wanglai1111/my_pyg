$(function(){

    // 调用，渲染结构
    render()

    // 创建个全局变量，所有分类数据
    var cateData;

    // 创建渲染函数，实现数据的动态渲染
    function render(){
        // 获取本地数据，判断是否超时，如果没有超时就直接使用本地数据进行数据结构的动态渲染
        cateData = JSON.parse(localStorage.getItem('pyg_cateData'))
        if(cateData && Date.now() - cateData.time < 24*60*60*1000){
            // 使用本地存储进行数据的渲染
            leftCateList()
            rightCateList(0)
        }
        // 如果超时，则再次发起ajax请求
        else{
            getCateList()
            console.log(result);
            
        }
    }

    // 发送请求获取分类数据
    function getCateList(){
        $('body').addClass('loadding')
        $.get('categories',function(result){ 
            if(result.meta.status == 200){
                console.log(111);
                
                cateData = {'list':result.data,time:Date.now()}
                localStorage.setItem('pyg_cateData',JSON.stringify(cateData))
    
                // 动态生成左侧导航项结构-一级分类
                leftCateList()
    
                // 动态生成右侧二级分类数据
                rightCateList(0)
            }
        },'json')
    }

    // 动态生成左侧导航项结构-一级分类
    function leftCateList(){
        var html = template('leftnavTemp',cateData)
        $('.left ul').html(html)
        // 初始化iscroll
        var myScroll = new IScroll('.left');
        
        // 为左侧li绑定单击操作
        $('.left').on('tap','li',function(){
            // jQuery样式的切换
            $(this).addClass('active').siblings().removeClass('active')
            // 实现 元素置顶
            myScroll.scrollToElement(this)

            // 动态渲染二级分类数据
            var index = $(this).index()
            rightCateList(index)
        })
    }

    // 动态生成右侧二级分类数据
    function rightCateList(index){
        var html = template('rightListTemp',cateData.list[index])
        // 生成了图片的动态结构
        $('.rightList').html(html)

        // 判断图片是否全部加载完毕
        var imgcount = $('.rightList img').length
        $('.rightList img').on('load',function(){
            // 只要触发这个事件，说明这张图片加载完毕了
            imgcount --
            if(imgcount == 0){
                $('body').removeClass('loadding')
                // 使用iscroll实现滑动效果
                var iscroll = new IScroll('.right')
            }
        })
    }
})