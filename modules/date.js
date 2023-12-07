exports.getDate = ()=>{
  // 匯入時間日期並轉變格式
  const today = new Date(); // 產生日期時間物件
  const options = {
    weekdays:"log",
    day: "numeric",
    month: "long"
  }; //設定date format
  return today.toLocaleString("en-US", options);
};
