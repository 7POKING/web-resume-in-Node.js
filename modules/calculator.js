
exports.calculateBMI = (weight, hight)=>{
  const bmiValue = Math.round((weight/Math.pow(hight/100,2)*10))/10;
//小數點後2位技巧https://www.delftstack.com/zh-tw/howto/python-pandas/pandas-get-index-of-row/
  return bmiValue;
};
