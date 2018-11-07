import $ from "jquery";
import "../index/common.js";
import "./index.less";
import "../index/index.less";
import "../expert_service/index.less";
import "../index/index.js";

// 网上找的鼠标滚动

$(function() {
  // var move = false;
  // $(".ai_banner").mousemove(function(evt) {
  //   var x = 0,
  //     y = 0;
  //   const timer = setTimeout(() => {
  //     var moveX = (evt.clientX - x) / 100 + "px";
  //     var moveY = (evt.clientY - y) / 50 + "px";
  //     x = evt.clientX;
  //     y = evt.clientY;
  //     console.log(moveX, moveY);
  //     $(".ai_banner .banner-img img").css({
  //       transform: "translateX(" + moveX + ") translateY(" + moveY + ") "
  //     });
  //     clearTimeout(timer);
  //   }, 100);
  // });

  var current = 1;
  setInterval(function() {
    current = current == 0 ? 1 : 0;
    $(".customer .controller span")
      .eq(current)
      .click();
  }, 10000);

  $(".customer .controller span").hover(function() {
    if ($(this).hasClass("active")) return false;
    const i = $(this).index();
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
    $(".customer .content .item")
      .eq(i)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
  // move img

  $(window).scroll(function() {
    moveimg();
  });
  moveimg();
  function moveimg() {
    const scrollY = $(window).scrollTop();
    const clientHeight = document.documentElement.clientHeight;
    $(".move-img").each(function() {
      const imgPosition = $(this)[0].offsetTop;
      const height = $(this).height();
      console.log(scrollY - imgPosition + clientHeight - height);
      if (scrollY - imgPosition + clientHeight - height > -550) {
        $(this).css({
          top: "0px",
          visibility: "inherit"
        });
      }
    });
  }
});
