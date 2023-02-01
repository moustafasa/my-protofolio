let lis = [...document.querySelectorAll(".parent >li:not(:first-of-type)")];
let childs = [...document.querySelectorAll(".parent>li .child")];

// show child ul
lis.forEach((li) => {
  li.addEventListener("click", (ev) => {
    ev.preventDefault();
    if (ev.currentTarget.classList.contains("active")) {
      ev.currentTarget.classList.remove("active");
    } else {
      lis.forEach((li) => {
        li.classList.remove("active");
      });
      ev.currentTarget.classList.add("active");
    }
  });
});
// stop propagation for child ul
childs.forEach((ch) => {
  ch.addEventListener("click", (ev) => ev.stopPropagation());
});
// hide child ul on blur
document.addEventListener("click", (ev) => {
  if (!ev.target.closest(".parent li")) {
    lis.forEach((li) => {
      li.classList.remove("active");
    });
  }
});

// show menu on mobile
let parent = document.querySelector(".parent");
let barI = document.querySelector(".bar-btn");
barI.addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("active");
  parent.classList.toggle("clicked");
});

// hide on blur
document.addEventListener("click", (e) => {
  if (!e.target.closest(".parent") && !e.target.closest(".bar-btn")) {
    if (
      parent.classList.contains("clicked") &&
      barI.classList.contains("active")
    ) {
      parent.classList.remove("clicked");
      barI.classList.remove("active");
    }
  }
});

// make header fixed on scroll to it
let nav = document.querySelector("nav");

window.onscroll = whenScroll;
let navPos = nav.offsetTop;
function whenScroll() {
  if (window.scrollY >= navPos) {
    if (!nav.classList.contains("scrolled")) {
      nav.classList.add("scrolled");
    }
  } else {
    // console.log("done");
    nav.classList.remove("scrolled");
  }
}
