// 匯出module，用module.exports
module.exports =(temp, product)=>{　
  let output =temp.replace(/{%PRODUCTNAME%}/g, product.productName); //第1行有let定義output函數
  //replace(要更換的項目, 跟換的項目) productName是data.json裡面的項目
  output =output.replace(/{%IMAGE%}/g, product.image); //接續output 將temp的東西更換，這邊更換的方法要看問與答
  output =output.replace(/{%PRICE%}/g, product.price);
  output =output.replace(/{%FROM%}/g, product.from);
  output =output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output =output.replace(/{%QUANTITY%}/g, product.quantity);
  output =output.replace(/{%DESCRIPTION%}/g, product.description);
  output= output.replace(/{%ID%}/g, product.id);
  output= output.replace(/{%HERF%}/g, product.herf);
  // /{templatet}/g 是global(全域使用)的意思，也是所有templplate都會被更換的意思
  if(!product.organic)output=output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  //增加如果為非有機，則顯示非有機，値得注意的是，這邊的if(){} 沒有用{}

  //2023/08/28 增加skill replace項目測試
  output =output.replace(/{%SKILLHREF%}/g, product.herf);
  output =output.replace(/{%SKILLIMAGE%}/g, product.skillimage);
  output =output.replace(/{%SKILLNAME%}/g, product.skillname);
  output= output.replace(/{%SKILLTIPS%}/g, product.tip);


  // 2023/09/02 增加skillfeatrue replace項目測試
  // output =output.replace(/{%SKILLHREF%}/g, product.herf);
  // output =output.replace(/{%SKILLIMAGE%}/g, product.skillimage);
  // output =output.replace(/{%SKILLNAME%}/g, product.skillname);

  return output;
  //最後要return
}
// productName 職務名稱
// image 公司標誌或職務icon
// from 公司名稱., 城市, 國家 
// nutrients 職稱 in 部門
// quantity 在職起訖
// price 職務說明
// organic 任職中的職位



