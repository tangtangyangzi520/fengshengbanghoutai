/** 
 *  格式化文章發布時間
 */
exports.customTime = item => {
  let nowTime = new Date().getTime()
  let minuteTime = 60*1000
  let hourTime = 60*minuteTime
  let dayTime = 24*hourTime
  let monthTime = dayTime * 30
  let yearTime = monthTime * 12

  let publishTime = new Date(item).getTime()
  let historyTime = parseInt(nowTime) - parseInt(publishTime)
  let descTime
  if(historyTime >= yearTime){
    //按年算
    descTime = parseInt(historyTime/yearTime) + '年前'
  }else if(historyTime< yearTime && historyTime >= monthTime){
    //按月算
    descTime = parseInt(historyTime/monthTime) + '月前'
  }else if(historyTime< monthTime && historyTime>= dayTime){
    //按天算
    descTime = parseInt(historyTime/dayTime) + '天前'
  }else if(historyTime< dayTime && historyTime>= hourTime){
    //按小时算
    descTime = parseInt(historyTime/hourTime) + '小时前'
  }else if(historyTime< hourTime && historyTime>= minuteTime){
    //按分钟算
    descTime = parseInt(historyTime/minuteTime) + '分钟前'
  }else{
    descTime = '刚刚'
  }
  return descTime
}

exports.formatDate =  (time) => {
  let tmpDate = new Date(time);
  let year = tmpDate.getFullYear();
  let month = tmpDate.getMonth() + 1;
  month = month<10 ? ('0'+month) : month;
  let day = tmpDate.getDate();
  day = day<10 ? ('0'+day) : day;
  let hours = tmpDate.getHours();
  hours = hours<10 ? ('0'+hours) : hours;

  let minutes = tmpDate.getMinutes();
  minutes = minutes<10 ? ('0'+minutes) : minutes;

  let seconds = tmpDate.getSeconds();
  seconds = seconds<10 ? ('0'+seconds) : seconds;
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes+ ':' + seconds
}