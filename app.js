// 1. 在command line中執行
// 2. 新增資料夾: mkdir 資料夾名稱
// 3. 進入預建立的資料夾: cd 資料夾名稱
// 4. 建立sever和網頁: touch app.js html
// 5. 將npm((node packge manger) 預設套件匯入: npm init -y
// 6. 安裝其他npm套件: npm i express ejs bod-parser ....
// 7. 在app.js中呼叫套件並設定: const express = require("express"); const app = express();
// 8. 設定port跟首頁網址(獲得位址("app.get"), 貼出資訊(app.post)): app.listen("3000", (req, res)=>{...}); app.get("/", (req, res){};)

// 簡短版履歷: 先可以找地方公開掛
// 目標:
// 1. 有字雲: 描述自己的相關文字
// 2. 相關認證的會移動得腰帶條 OK
// 3. 連結到說明技能的頁面 OK
// 4. 可以下載論文的網頁連結
// 5. 底圖加入格線
// 6. 經歷可以有動畫 OK

const fs = require("fs"); //匯入資料用的模組fs 是file system的簡稱
//自訂模組解釋: https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080944#overview
const replaceTemplate = require("./modules/replaceTemplate"); //匯入replaceTemplate自訂模組 用於替代資料
const day = require(__dirname + "/modules/date.js"); //嘗試載入自訂模組
const calculator = require(__dirname + "/modules/calculator"); //載入calculator自訂模組
const express = require("express");
const app = express();
const _ = require("lodash");
const { URL } = require("url"); // 引入 URL 模組
const puppeteer = require("puppeteer"); // 導入讀取pdf模組
const path = require("path");

const slugify = require("slugify");
const ejs = require("ejs"); //ejs模板
const lowerCase = require("lodash.lowercase"); //lodash 用於將空格等符號刪除
const WordCloud = require("node-wordcloud"); //用於產生字雲
const { createCanvas } = require("canvas");
const { Script } = require("vm");

bodyParser = require("body-parser");
app.set("view engine", "ejs"); // 使用ejs套件 說明文件: https://github.com/mde/ejs/wiki/Using-EJS-with-Express

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
); //使用匯入的body-parser 並且可接受槽狀迴圈

app.use(express.static("public")); // 使用 匯入CSS檔案 https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/12384942#notes
app.use("/images", express.static("images")); //匯入圖檔的方法

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let posts = [];

var resultBMI = "";
var weight_Status = "";
const dayDate = day.getDate();

const skillOverview = fs.readFileSync(
  `${__dirname}/templates/skill-overview.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

app.get("/", async (req, res) => {
  try {
    const [cardJson, eduJson, skJson, articleJson, cerJson] = await Promise.all(
      [
        fs.promises.readFile(`${__dirname}/dev-data/data.json`, "utf-8"),
        fs.promises.readFile(`${__dirname}/dev-data/education.json`, "utf-8"),
        fs.promises.readFile(`${__dirname}/dev-data/skill.json`, "utf-8"),
        fs.promises.readFile(`${__dirname}/dev-data/article.json`, "utf-8"),
        fs.promises.readFile(`${__dirname}/dev-data/certificate.json`, "utf-8"),
      ]
    );
    const articleJsonObject = JSON.parse(articleJson);

    const jsonObject = JSON.parse(cardJson); // 將 JSON 字串轉換為 JavaScript 物件
    const jsonEducation = JSON.parse(eduJson);
    const jsonSkill = JSON.parse(skJson);
    const jsonCertificate = JSON.parse(cerJson);
    const cardsHtml = jsonObject
      .map((el) => replaceTemplate(tempCard, el))
      .join(""); // 要轉換成文字，不然會有逗點
    const collapseTarget = jsonEducation.map((item) => item.target).join("");
    const jsonCertificatecollapseTarget = jsonCertificate
      .map((item) => item.target)
      .join("");
    const skillHtml = jsonSkill
      .map((item) => replaceTemplate(skillOverview, item))
      .join("");
    // console.log(articleJsonObject)

    for (const feature in articleJsonObject) {
      console.log(articleJsonObject[feature].feaTitle);
    }

    res.render("resume", {
      skillOverview: skillHtml,
      tempOverview: cardsHtml,
      jsonEducation, //JSON數據
      jsonCertificate,
      collapseTarget,
      jsonCertificatecollapseTarget,
      // skillsData,
      // carouselSkill,
      kindOfDay: dayDate,
      articleJsonObject,
    });
  } catch (error) {
    console.error("解析 JSON 時發生錯誤：", error);
    res.status(500).send("解析 JSON 時發生錯誤");
  }
});

app.get("/skill", (req, res) => {
  // 獲取此網頁相關參數資訊-----------------------------------------------------------------------
  let skillfeature = req.query.feature;
  console.log(req.url, req.query, "\n", req.query.feature);
  fs.readFile(
    `${__dirname}/dev-data/skillfeature.json`,
    "utf-8",
    (err, skillhrefdata) => {
      if (err) {
        console.error("讀取檔案時發生錯誤：", err);
        res.status(500).send("讀取檔案時發生錯誤"); //回傳錯誤訊息，可以加圖片
      } else {
        try {
          const skilljsonObject = JSON.parse(skillhrefdata); // 將 JSON 字串轉換為 JavaScript 物件
          let jsonObject_skillfeature = skilljsonObject[skillfeature];
          let jsonObject_skillfeature_image =
            skilljsonObject[skillfeature + "image"];
          let jsonObject_skillfeature_competence =
            skilljsonObject[skillfeature + "competence"];
          console.log(jsonObject_skillfeature_image);

          res.render("skillFeature", {
            jsonObject_skillfeature,
            jsonObject_skillfeature_image,
            jsonObject_skillfeature_competence,
            kindOfDay: dayDate,
          });
        } catch (error) {
          console.error("解析 JSON 時發生錯誤：", error);
          res.status(500).send("解析 JSON 時發生錯誤");
        }
      }
    }
  );
});

app.get("/product", (req, res) => {
  // 獲取此網頁相關參數資訊-----------------------------------------------------------------------
  let experience_id = req.query.id;
  console.log(req.url, req.query, "\n", experience_id);

  const myURL = new URL(`http://${req.headers.host}${req.url}`); // 創建 URL 物件
  // console.log(myURL) 獲取 URL物件
  const pathName = myURL.pathname; // 獲得路徑名，不包括查詢參數
  const searchParams = myURL.searchParams; // 獲得查詢參數
  //-------------------------------------------------------------------------------------------
  fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //設置回傳API的內容

    if (err) {
      console.error("讀取檔案時發生錯誤：", err);
      res.status(500).send("讀取檔案時發生錯誤"); //回傳錯誤訊息，可以加圖片
    } else {
      try {
        const jsonObject = JSON.parse(data)[experience_id]; // 將 JSON 字串轉換為 JavaScript 物件
        console.log(jsonObject);
        // const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const productHtml = replaceTemplate(tempProduct, jsonObject); // 不需要轉成文字
        res.render("exPerience", {
          exPerience: productHtml,
          kindOfDay: dayDate,
        });
      } catch (error) {
        console.error("解析 JSON 時發生錯誤：", error);
        res.status(500).send("解析 JSON 時發生錯誤");
      }
    }
  });
});

//測試使用__dirname 標準文件夾名稱
const test_text = fs.readFile(
  `${__dirname}/dev-data/data.json`,
  "utf-8",
  (err, data) => {
    const dataObj = JSON.parse(data); //解析Json數據
    // console.log(dataObj);
    return dataObj;
  }
);

//PDF-------------------------------------------------------------------------
app.get("/articles", async (req, res) => {
  try{
  // console.log('PDF')
  let articleTitle = req.query.article;
  console.log(req.url, req.query, "\n", articleTitle);

  // const pdfPath = 'article/Master Thesis abstract.pdf'; // 替换成你的 PDF 文件路径
  const pdfPath = articleTitle;
  // 使用绝对路径拼接 PDF 文件路径
  const fullPath = path.resolve(__dirname, pdfPath);

  // 设置响应头，告诉浏览器返回的是 PDF 文件
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=example.pdf");

  // 通过流的形式将 PDF 文件发送给浏览器
  const stream = fs.createReadStream(fullPath);
  stream.pipe(res); } catch(e){
    const cvpdfPath = "article/20231207 update CV In English.pdf"
      // 使用绝对路径拼接 PDF 文件路径
  const fullPath = path.resolve(__dirname, cvpdfPath);

  // 设置响应头，告诉浏览器返回的是 PDF 文件
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=example.pdf");

  // 通过流的形式将 PDF 文件发送给浏览器
  const stream = fs.createReadStream(fullPath);
  stream.pipe(res); 

    };
});

//BMI--------------------------------------------------------------------------
app.get("/calculatorBMI", (req, res) => {
  res.render("calculatorBMI", {
    bmiValue: resultBMI,
    kindOfDay: dayDate,
    weightStatus: weight_Status,
  });
});

app.post("/calculatorBMI", (req, res) => {
  console.log(req.body); //要求獲得數據
  var calcuateResult = calculator.calculateBMI(req.body.weight, req.body.hight);
  resultBMI = "Your BMI is " + calcuateResult;
  //switch可以參考說明 https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/12384846?start=911#notes
  //比大小的方法可以參考 https://stackoverflow.com/questions/6665997/switch-statement-for-greater-than-less-than
  switch (true) {
    case calcuateResult < 18.5:
      weight_Status = `Underweight This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`; //測試
      break;
    case calcuateResult >= 18.5 && calcuateResult < 24.9:
      weight_Status = "Healthy Weight";
      break;
    case calcuateResult >= 25.0 && calcuateResult < 29.9:
      weight_Status = "Overweight";
      break;
    case calcuateResult >= 30.0:
      weight_Status = "Obesity";
      break;
    default:
      console.log("Error: Not Exception Value");
      weight_Status = "Error: Not Exception Value";
  }

  console.log(resultBMI);
  res.redirect("/calculatorBMI");
});

//diceeGame-----------------------------------------------------------------------------------------------------------------------------------
app.get("/diceeGame", (req, res) => {
  res.render("dicee");
});

// dicee ----------------------------------------
// var randomNumber1 = Math.floor(Math.random()*6+1);
// console.log(randomNumber1);
// var randomNumber2 = Math.floor(Math.random()*6+1);
// console.log(randomNumber2);
//
// if(randomNumber1>randomNumber2){
// document.querySelector("h1").innerHTML="🚩Player1 Wins!";
// }else if(randomNumber1<randomNumber2){
// document.querySelector("h1").innerHTML="Player2 Wins!🚩";
// }else{document.querySelector("h1").innerHTML="Draw!";}
//
// dice1Picture = 'images\\\dice'+ randomNumber1+'.png'
// document.querySelector(".img1").setAttribute("src", dice1Picture);
//
// dice2Picture = 'images\\\dice'+ randomNumber2+'.png'
// document.querySelector(".img2").setAttribute("src", dice2Picture)

//Blog--------------------------------------------------------------------------
app.get("/blogHome/", (req, res) => {
  // console.log(posts);

  res.render("blogHome", {
    startingContent: homeStartingContent,
    postlists: posts, //challenge 12
    kindOfDay: dayDate,
  });
});

app.get("/blogHome/postTitle/:postTitle", (req, res) => {
  let postTitle = _.lowerCase(req.params.postTitle); //變成小寫，利用locash將"-"等符號去掉
  posts.forEach((post) =>
    post.title == postTitle
      ? console.log("Match found")
      : console.log("Not Found")
  ); //比較值不比較型態
});

app.get("/blogAbout", (req, res) => {
  res.render("blogAbout", {
    aboutContent: aboutContent,
    kindOfDay: dayDate,
  });
});

app.get("/blogCompose", (req, res) => {
  res.render("blogCompose", {
    kindOfDay: dayDate,
  });
});

app.get("/blogPost/:postName", (req, res) => {
  posts.forEach(function (post) {
    let postTitle = _.lowerCase(req.params.postName);

    console.log(postTitle);
    if (post.title == postTitle) {
      console.log("Match found");
      res.render("blogPost", {
        postTitle: post.title, //這裡的post是forEach帶出posts的項目，在確認在post裡後列出
        postContent: post.content,
        kindOfDay: dayDate,
      });
    }
  });
});

app.post("/blogCompose", (req, res) => {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  }; // JS物件
  posts.push(post);
  res.redirect("/blogHome");
  // console.log(req.body.postTitle)
  // res.render("blogCompose",{kindOfDay: dayDate,});
});

app.listen("7000", (req, res) => {
  console.log("Server is running on port 7000");
});

//非ES6版本
// app.listen("7000", function(req, res) {
//   console.log("Server is running on port 7000");
// });

//使用http 產生的伺服器
// const server = http.createServer((req, res)=>{
//   res.end("Hello from the server!")
// });

// server.listen(8000, '127.0.0.1', ()=>{
//   console.log('Listening to requests on port 8000');
// });

//課堂23
//Challenge 1: 產生Home頁面----------------
// app.get((req, res)=>{res.send("Home")}); //答錯
//1. 新增home.ejs頁面在 views裡面
//2. app.get("/",(req, res)=>{res.render("Home")}); //正確答案
//3. app.listen("3000", (req, res)=>{console.log("Server is running on port 7000");});

// Challenge 2: 將homeStartingContent文字顯示在home packge-------------使用目標將resume裡面的內容重複的，簡化為少數行
// const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
//home.ejs 鍵入<p> <%=Startingcontent%> </p>
// app.post("/",(req, res)=>{res.render("home", {Startingcontent: homeStartingContent})}); //錯誤
// app.get("/", (req, res)=>{res.resnder("home", {Startingcontent: homeStartingContent})});

//Challenge 3:，建立header.ejs 與 footer.ejs並且帶入home.ejs中-------------------------------
//1. 在home.ejs輸入html 將header與footer 的不份剪貼至heade.ejs或footer.ejs中
//2. 在hoem.ejs頁面中加入 上方<%- include("partials/header")%> 下方<%- include("partials/footer")%>

//Challenge 4: 新增partials資料夾，將header.ejs 與footer.ejs移入，之後沒加入partials資料夾於路徑時會出現異常，將異常修正
//1. 在 路徑前方加入partials <%- include("partials/header")%> 下方<%- include("partials/footer")%>

//Challenge 5: 當路徑變更為/about時顯示aboutContent，為/contact時顯示contactContent--------------------
// const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
//1. 於views資料夾裡新增about.ejs 與 contact.ejs
//2. 加入partials <%- include("partials/header")%> 下方<%- include("partials/footer")%>加入
//3. 分別新增 app.get("/about", res.resnder("about",{apoutString: aboutContent}))，在about.ejs加入<%=aboutString%>
//4. 分別新增 app.get("/contact", res.resnder("contact",{contactString: contactContent}))，在contact.ejs加入<%=contactString%>

//Challenge 6: 網址連結可到contact.ejs 或 about.ejs，但無法按下nav bar按下連結後連到該網頁，所以設定按鈕連結到該網頁------------------------
//在header.ejs 使用連結
//1.<a href="/about">ABOUT</a>
//2.<a href="/contact">CONTACT</a>

// Challenge 7: 新增compose頁面，當網址輸入compose時，可連線到compose畫面，並且有Compose字樣與輸入欄位和Publish按鈕------------------------
//網頁格式:
// <%-include ("partials/header")%>
//   <h1>Compose</h1>
// <input type="text" name="" value="" placeholder="">
//     <button type="submit" name="" class="BUTTON_BMI" >Publish</button>
// <%-include("partials/footer")%>

// app.js的內容
// app.get("/compose", (req, res) =>{
//   res.render("compose",{kindOfDay: dayDate,});
// });

//Challenge 8: compose頁面輸入資料後，按下post 在 console.log()跳出-------------------------------------------------
// 1. 在blogCompose.ejs 建立 form:
// <form action="/blogCompose" method="post">
//   <h1>Compose</h1>
//   <!-- dl列表 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd -->
//   <dl class="">
//     <!-- <dt></dt> -->
//     <dd>  <input type="number" name="postTitle" value="" placeholder=""></dd>
//     <button type="text" name="" class="BUTTON_BMI" >Publish</button>
//   </dl>
// </form>

//2. action 設定"/blogCompose" 相同網址，按下後不跳到別頁，並且name設定要讀取的名稱 <dd>  <input type="number" name="postTitle" value="" placeholder=""></dd>
//3. 在app.js 新增 app.post("/blogCompose", (req, res)=>{ console.log(req.body.postTitle)}); 用於回應form中的button的動作
// In order for this to actually make a post request to our server we're going to have to put it inside a form so that when we submit the form we can pass over the value that the user typed into this input over to our app.js.
//獲得資料的概念
//
// 遞交/compose路徑，獲得form表格中所提交submit名稱name的資料
//
// 路徑可以隨意定義，只要定義的跟app.post("路徑", function(req, res){}); 裡的路徑相同就可以，但一般為避免搞混，會定義的跟頁面名稱相同
//
// So we post to the /compose route and we have an input that is of type text that needs to have a name  and we have a button that submits the form.

//Challenge 9. blogCompose頁面 增加可輸入標題欄位(單行) 與 內容欄位(多行) 與publish按鈕，可符合Bootstrap格式----------------------------------------------------
// <form action="/blogCompose" method="post">
//   <!-- 用bootstrap 控制 form格式 https://getbootstrap.com/docs/5.0/forms/form-control/ -->
//   <div class="mb-3">
//     <label for="" class="form-label">Title</label>
//     <input type="text" class="form-control" id="" placeholder="">
//   </div>
//   <!-- 多行輸入格 可參考 https://stackoverflow.com/questions/6262472/multiple-lines-of-input-in-input-type-text -->
//   <div class="mb-3">
//     <label for="" class="form-label">Post</label>
//     <textarea class="form-control" id="exampleFormControlTextarea1" rows="8"></textarea>
//   </div>
//   <button type="text" name="" class="BUTTON_BMI">Publish</button>
// </form>

//Challenge 10. 產生JS 物件，可存取 postTitle 和 postbody-------------------------------------------
//自己的裡解
// app.post("/blogCompose", (req, res) =>{
//   var  postArticle = {"postTitle": req.body.postTitle, "postBody": req.body.postBody} // JS物件
//   // console.log(req.body.postTitle)
//   console.log(postArticle)
//   // res.render("blogCompose",{kindOfDay: dayDate,});
// });
//與解答相同，但建議改成const，所以改成跟課堂一樣
// const  post = {
//    title: req.body.postTitle,
//   content: req.body.postBody} --> JS物件

//Challenge 11. 產生命名為posts 的 golobal variable arry，每次桉下submit 時，將post存進去，並返回bloghome頁，在console.log 所產生的arry-----------------------------------------------
// let posts =[]; 這個全境變數，必須為在function外圍
// 自己解答:
// posts.push(post)
// res.redirect("/blogHome")
// console.log(posts)
// 解答正確，但課堂將console.log用在 執行home頁面時，產生列印，移動至與課堂相同

//Challenge 12. 將posts在執行home頁時 console.log出來-----------------------------------------------------------------
// app.js編輯
// app.get("/blogHome", (req, res) =>{
//   console.log(posts);
//
//   res.render("blogHome",{
//     startingContent: homeStartingContent,
//     postlists:posts, //challenge 12
//     kindOfDay: dayDate,});
// });
//blogHome.ejs編輯
// <% console.log(postlists)%>

//Challenge 13. 把posts.title在執行home頁時，console.log迭代顯示------------------------------------------------------
//自己的答案錯在.title
// <% for(var i = 0; i< postlists.length; i++){%>
//   <% console.log(postlists[i][title])%>
// <% } %>
//正確是
// <% for(var i = 0; i< postlists.length; i++){%>
//   <% console.log(postlists[i].title);%>
// <% }; %>

//Challenge 14. 把 challenge 13.的for loop轉成foreach--------------------------------------------------------------------------------------
// 改成forEach 參考 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
// <% postlists.forEach((element) => {console.log(element.title)});%>

//Challenge 15. 將compose編輯的title跟post的內容顯示在home頁
//注意要將值輸入到網頁上 ejs 必須使用<%=，另外HTML tag要在ejs Taq外面

// <% postlists.forEach((element) => {%>
//    <h1 class ="blogtitle"><%= element.title %></h1>
//    <p><%= element.poist %></p>
// <% });%>

//Challenge 16. 在blogHome時，網址列輸入的參數直顯示在console.log()-----------------------------------------------------------
//參考Express 文件 https://expressjs.com/en/guide/routing.html
//自己的作法是在新增一個
// app.get("/blogHome/:hometitle", (req, res)=>{
//   res.redirect("/blogHome")
//   console.log(req.params.hometitle)
// })

//但題目只是要表達使用某總路徑時，並不會有res.render()只要列印出字串就可以了
// 可以像下方這樣，在首頁時，於網址輸入 /字元，則會在console.log印出，但不會跳動頁面
// app.get("/blogHome/:postTitle", (req, res)=>{
//   console.log(req.params.postTitle)
// })
// /blogHome/:postTitle 這一段要加在首頁網址後面，包含"/"

//Challenge 17. 在blogHome時，網址列輸入的title如果有在posts list則console.log("Match fund")不需在意大小寫--------------------------------------------------
//自己的答案
// app.get("/blogHome/postTitle/:postTitle", (req, res)=>{
//   let postTitle = req.params.postTitle.toLowerCase();
//   console.log(postTitle)
//   (postTitle in posts)? console.log("Match found"): console.log("Not Found")
// })
//本來嘗試使用 "test" in Object.values.title https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values
// 課堂使用Object.forEach(element=>element)

//Challenge 18. 如果是中間有空格時，網址列無法分變空格，使用loacash可以除空格或符號等，讀locash文件解決此問題-------------------------------------------------
//安裝lodash
// const _ = require('lodash');
// const lowerCase = require('lodash.lowercase'); //lodash 用於將空格等符號刪除
// app.get("/blogHome/postTitle/:postTitle", (req, res)=>{
//   let postTitle = _.lowerCase(req.params.postTitle)//變成小寫，利用locash將"-"等符號去掉
//   posts.forEach((post => post.title ==postTitle? console.log("Match found"):console.log("Not Found") )) //比較值不比較型態
// })

//challege 19. posts網址加標題後可跳到專屬網頁---------------------------------------------------------------------------
//// TODO: 這裡卡很久，發現無法帶入CSS弄了很久發現是header.js中css路徑問題
//原本 <link rel="stylesheet" href="css/styles.css">
//發現問題<link rel="stylesheet" href="/css/styles.css">
//兩者差意只在 href="/css 的CSS前面有沒有 /

//解答
// app.get("/blogPost/:postName", (req, res) => {
//   posts.forEach(function(post) {
//     let postTitle = _.lowerCase(req.params.postName)
//     if (post.title == postTitle) {
//       console.log("Match found");
//       res.render("blogPost",{
//         postTitle: post.title, //這裡的post是forEach帶出posts的項目，在確認在post裡後列出
//         postContent: post.content,
//         kindOfDay: dayDate})
//     };
//   })

//Challenge 20. 使用JS function使首頁顯示前100個字，並在100字尾端接上"..."-------------------------------------------------------------------
//使用substring() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
// <p><%= element.content.substr(0,100)+"..." %></p>

//Challenge 21. 每篇文章"..."後方加上"read more"，按下後超連結到那一篇文章的post-------------------------------------------------------------

//本來experience要用但是無法使用 5/27先取消-------------------------------------------------------------
// const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
// // map語法: let new_array = arr.map(function(function相關參數){})
// //步驟1. 將dataObj經過map裡面的function處理後，產生新的list
// //步驟2. list無法產生html，因為屬於文字所以用.join("")轉成文字
// // console.log(cardsHtml);
// const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
// res.end(output); //這個放在前面會出現 Can't set headers after they are sent. 但是移到 res.send後就沒有了? 參考-->https://www.itread01.com/content/1543046051.html
//用一般html顯示頁面的方法----------------------------------------------------
// res.sendFile(__dirname + "/templates/index.html");
// res.end(output); //這個要放在後面，但使用ejs的表示法時，卻放在前面
// // 這邊為了要把experience的東西塞進去，會有使用res.send()和res.end()的差異問題

// res.end(output);

//--------------------------------------------------------------------------------
// 2023/08/14 含測試的resum
// app.get('/', (req, res)=> { //get獲得'/'反應回應將resume.ejs頁面，並且用API概念獲得數據回傳
//   fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8',(err, data)=>{ //設置回傳API的內容

//     if (err) {
//       console.error('讀取檔案時發生錯誤：', err);
//       res.status(500).send('讀取檔案時發生錯誤');//回傳錯誤訊息，可以加圖片
//     } else {
//       try {
//         const jsonObject = JSON.parse(data); // 將 JSON 字串轉換為 JavaScript 物件
//         const jsonString = JSON.stringify(jsonObject); // 將 JavaScript 物件轉換為 JSON 字串
//         // res.render('index', jsonObject); // 將 JavaScript 物件傳遞給視圖模板進行渲染
//         const cardsHtml = jsonObject.map(el => replaceTemplate(tempCard, el));
//         // const tempOverview =cardsHtml
//         res.render("resume", {
//           // testJson: jsonObject[0]["productName"], //測試 JSON資料匯出狀態
//           // testJson: jsonString, //測試ejs的功能
//           tempOverview :cardsHtml,
//           kindOfDay: dayDate,
//         });
//       } catch (error) {
//         console.error('解析 JSON 時發生錯誤：', error);
//         res.status(500).send('解析 JSON 時發生錯誤');
//       }
//     }
//   });
// });

// ----------------------------------------------------------------------
//wordcloud 20230712新增-------------------------------------------------------------------

//產生2D畫面

// const text = '這裡是你的簡歷文字內容，可以包含教育背景、工作經驗等等。';

// const options = {
//   list: text.split(' '),
//   fontFamily: 'Arial',
//   fontWeight: 'bold',
//   color: 'random-dark',
//   backgroundColor: '#ffffff',
//   rotateRatio: 0.5,
//   shuffle: false,
//   ellipticity: 0.5,
//   gridSize: 12,
//   minSize: 10,
//   weightFactor: 6,
//   shape: 'circle',
//   drawOutOfBound: false,
//   origin: null,
//   canvas: createCanvas, // 使用 createCanvas 函式作為 canvas 屬性的值
// };

// const wordcloud = WordCloud(options);

// // wordcloud.build((err, words) => {
// //   if (err) {
// //     console.error('文字雲生成失敗:', err);
// //     return;
// //   }

// //   const imageBuffer = wordcloud.toBuffer('image/png'); // 將文字雲轉換為圖片 Buffer

// //   fs.writeFileSync('wordcloud.png', imageBuffer);

// //   console.log('文字雲已成功生成！');
// // });

// wordcloud.build((err, words) => {
//   if (err) {
//     console.error('文字雲生成失敗:', err);
//     return;
//   }

//   const imageBuffer = wordcloud.toBuffer('image/png'); // 將文字雲轉換為圖片 Buffer

//   fs.writeFileSync('wordcloud.png', imageBuffer);

//   console.log('文字雲已成功生成！');
// });

// -------------------------------------------
//匯入頁面資料，並塞到變數裡
// const tempOverview =fs.readFileSync(`${__dirname}/templates/index.html`, 'utf8')
// const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
// // const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
//
// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// //匯入json資料，並且將json資料物件化
// const dataObj = JSON.parse(data);//將本來是str的資料轉成json物件
//
// const slugs = dataObj.map(el =>slugify(el.productName, {lower: true})) //ES6 用map產生新連續array，用el.productName取出產品名
// console.log(slugs);//測試slugify的功能

//2023/08/01  測試fs 塞入檔案文件
// Blocking, synchronous way 會block住的非同步語法，主要觀察fs.readFileSync
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/input.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way 不會block住的同步語法，主要觀察fs.readFile
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if(err)return console.log('ERROR!')
//   fs.readFile(`./txt/${data1}`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err=>{
//         console.log('Your file has been written');
//       })
//     });
//   });
// });
// console.log('Will read file!')

//20230823 動態式collapse 按鈕-------------------------------------------------------------------------------------
// <!-- Call to Action 改成 education section-->
// <div id="buttonContainer">
//   <!-- 這裡將動態生成按鈕 -->
// </div>

// <div id="contentContainer">
//   <!-- 這裡將動態生成內容 -->
// </div>

// <script>
//   const jsonData = [
//     { title: 'Content 1', target: 'collapseContent1' },
//     { title: 'Content 2', target: 'collapseContent2' },
//     { title: 'Content 3', target: 'collapseContent3' },
//     // 其他 JSON 數據...
//   ];

//   const buttonContainer = document.getElementById('buttonContainer');
//   const contentContainer = document.getElementById('contentContainer');

//   jsonData.forEach((item, index) => {
//     const button = document.createElement('button');
//     button.className = 'btn btn-light mb-3 col-8 mx-auto';
//     button.type = 'button';
//     button.dataset.bsToggle = 'collapse';
//     button.dataset.bsTarget = `#${item.target}`;
//     button.setAttribute('aria-expanded', 'false');
//     button.setAttribute('aria-controls', item.target);
//     button.textContent = item.title;

//     const content = document.createElement('div');
//     content.id = item.target;
//     content.className = 'collapse';
//     content.textContent = item.title + ' content'; // 可替換為實際內容

//     buttonContainer.appendChild(button);
//     contentContainer.appendChild(content);
//   });
// </script>

//-----------------------------------------------------------------

// 按鈕展開下方，數量藉由JSON控制

//   <div id="container">
//   <!-- 這裡將動態生成按鈕和內容 -->
//   </div>

// <script>
// const container = document.getElementById('container');
// jsonEducation.forEach((item, index) => {
//   const button = document.createElement('button');
//   button.className = 'btn btn-light mb-3 col-8 mx-auto';
//   button.type = 'button';
//   button.dataset.bsToggle = 'collapse';
//   button.dataset.bsTarget = `#${item.target}`;
//   button.setAttribute('aria-expanded', 'false');
//   button.setAttribute('aria-controls', item.target);
//   button.textContent = item.title;

//   const content = document.createElement('div');
//   content.id = item.target;
//   content.className = 'collapse';
//   content.textContent = item.title + item.content; // 可替換為實際內容

//   const row = document.createElement('div');
//   row.className = 'row';
//   row.appendChild(button);
//   row.appendChild(content);

//   container.appendChild(row);
// });
// </script>

//-----------------------------------------------------------
