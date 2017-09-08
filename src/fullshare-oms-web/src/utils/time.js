/**
 * Created by xiangzhoumeng on 2016/8/11.
 */
export  function countDown(times){
    var timeTemp,                           // 临时时间
      remain_sec = 0,                     // 秒
      remain_minute = 0,                  // 分钟
      remain_hour = 0,                    // 小时
      timetag = Date.now(),               // 上一帧的时间
      hour = 0,                           // 最终显示小时
      min = 0,                            // 最终显示分钟
      sec = 0,                            // 最终显示秒
      str = '';
    function count(){
      timeTemp = parseInt(times / 1000);
      // 秒数
      remain_sec = timeTemp % 60;
      timeTemp = parseInt(timeTemp / 60);
      // 分数
      remain_minute = timeTemp % 60;
      timeTemp = parseInt(timeTemp / 60);
      // 小时数
      remain_hour = timeTemp % 24;
      timeTemp = parseInt(timeTemp / 24);
    }

    count();

    function begin() {
      var minus = Date.now() - timetag;
      if ((minus) >= 1000) {
        times = times - minus;
        count()
        //   当时间结束后倒计时停止
        if ((remain_minute <= 0) && (remain_sec <= 0) && (remain_hour <= 0)) {
          remain_minute = remain_sec = remain_hour = 0;
          return;
        }
        timetag = Date.now();
      }
      // 以下部分做为时间显示时补零
      if (remain_hour < 10) {
        hour = '0' + remain_hour;
      } else {
        hour = remain_hour;
      }
      if (remain_minute < 10) {
        min = '0' + remain_minute;
      } else {
        min = remain_minute;
      }
      if (remain_sec < 10) {
        sec = '0' + remain_sec;
      } else {
        sec = remain_sec;
      }
      window.requestAnimationFrame(begin);
      console.log(hour + ':' + min + ':' + sec)
      str =  hour + ':' + min + ':' + sec;
    }
    window.requestAnimationFrame(begin);
    return str;
}