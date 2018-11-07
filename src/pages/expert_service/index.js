import $ from "jquery";
import "../index/common.js";
import "../index/index.less";
import "../index/index.js";
import "./index.less";

$(function() {
  // var move = false;
  // $(".expertBanner").mousemove(function(evt) {
  //   var x = 0,
  //     y = 0;
  //   const timer = setTimeout(() => {
  //     var moveX = (evt.clientX - x) / 100 + "px";
  //     var moveY = (evt.clientY - y) / 50 + "px";
  //     x = evt.clientX;
  //     y = evt.clientY;
  //     console.log(moveX, moveY);
  //     $(".expertBanner .banner-img img").css({
  //       transform: "translateX(" + moveX + ") translateY(" + moveY + ") "
  //     });
  //     clearTimeout(timer);
  //   }, 100);
  // });

  $(".personality-service .item").hover(function() {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
  $(".private-items .item").hover(function() {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
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
  var current = 1;
  setInterval(function() {
    current = current == 0 ? 1 : 0;
    $(".customer .controller span")
      .eq(current)
      .click();
  }, 10000);
});
