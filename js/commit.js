//添加zepto拦截器
$(()=>{
  const baseURL = 'http://157.122.54.189:9094/api/public/v1/'
  $.ajaxSettings.beforeSend = (xhr,obj)=>{
    //拼接url
    obj.url = baseURL + obj.url
  }
})