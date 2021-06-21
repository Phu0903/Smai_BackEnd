setTimeout(function () {
   $('.wrap-loader').fadeToggle();
}, 1800);

const menuBtn = document.querySelector(".menu-icon span");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const items = document.querySelector(".header-items");
const user = document.querySelector(".header-user")
const form = document.querySelector("form");
menuBtn.onclick = () => {
   items.classList.add("active");
   user.classList.add("active");
   menuBtn.classList.add("hide");
   searchBtn.classList.add("hide");
   cancelBtn.classList.add("show");
}
cancelBtn.onclick = () => {
   items.classList.remove("active");
   user.classList.remove("active");
   menuBtn.classList.remove("hide");
   searchBtn.classList.remove("hide");
   cancelBtn.classList.remove("show");
   form.classList.remove("active");
   cancelBtn.style.color = "#ff3d00";
}
searchBtn.onclick = () => {
   form.classList.add("active");
   searchBtn.classList.add("hide");
   cancelBtn.classList.add("show");
}


