
const $ = require("jquery")

var randomNumber1 = Math.floor(Math.random()*6+1);
console.log(randomNumber1);
var randomNumber2 = Math.floor(Math.random()*6+1);
console.log(randomNumber2);

if(randomNumber1>randomNumber2){
document.querySelector("h1").innerHTML="🚩Player1 Wins!";
}else if(randomNumber1<randomNumber2){
document.querySelector("h1").innerHTML="Player2 Wins!🚩";
}else{document.querySelector("h1").innerHTML="Draw!";}

dice1Picture = 'images\\\dice'+ randomNumber1+'.png'
document.querySelector(".img1").setAttribute("src", dice1Picture);

dice2Picture = 'images\\\dice'+ randomNumber2+'.png'
document.querySelector(".img2").setAttribute("src", dice2Picture)

// for (var i = 0; i < n; i++) {
//   document.querySelectorAll(".drum")[i].addEventListener("click", function(){
//     console.log(this.innerHTML);
//     this.style.color= "white";
//     var buttonInnerHTML= this.innerHTML;
//     switch (buttonInnerHTML) {
//       case "w":
//           new Audio("sounds/crash.mp3").play();
//         break;
//
//         case "a":
//             new Audio("sounds/kick-bass.mp3").play();
//           break;
//
//       default:console.log(buttonInnerHTML)
//
//     }
//   });
// }
