import { add } from "./classes.js";
// make heads and subject from head num
let startBtn = document.querySelector(".start");
let headNum = document.querySelector(".head-num-input");
startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  headNum.closest(".headNum").classList.add("done");
  let ad = new add();
  ad.addAll(headNum.value);
});
