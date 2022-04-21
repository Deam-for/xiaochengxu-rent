const formatTime = date => {
  var date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
const formatDay=date=>{
  var date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${[year, month, day].map(formatNumber).join('/')} `
}

const formatupadte=date=>{
  let data=Date.now()-date;
    if((data/1000/60)>=60){
      if(data/3600/1000>24){
        if(data/3600/24/1000>5){
            return formatDay(date)
        }else{
          return Math.floor(data/3600/24/1000)+'天前'
        }
      }else{
        return Math.floor(data/3600/1000)+'小时前'
      }
    }else{
      return Math.floor(data/60/1000)+'分钟前'
    }
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  formatDay,
  formatupadte
}
