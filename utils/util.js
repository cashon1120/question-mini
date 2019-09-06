const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


//数据转化
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function dateFMT(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

const setStr = num => {
  let newNum = num
  if (newNum <= 9) {
    newNum = `0${newNum}`
  }
  return newNum
}

const leftFormatTime = (mss, type) => {
  const days = Math.floor(mss / (1000 * 60 * 60 * 24))
  const hours = setStr(parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  const minutes = setStr(parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)))
  const seconds = setStr(parseInt((mss % (1000 * 60)) / 1000))
  if (type === 1) {
    return `${hours}时${minutes}分${seconds}秒`
  }
  return `${minutes}:${seconds}`
}

function backUrl(history,nolist){
  let url;
  for (let a = history.length-1;a>=0;a--){
    if (nolist.indexOf(history[a].route)<0){
      url = history[a].route;
      break;
    }
  }
  return url;
}

module.exports = {
  formatTime, leftFormatTime,
  dateFMT, backUrl
}