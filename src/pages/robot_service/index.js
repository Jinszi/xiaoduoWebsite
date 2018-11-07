import $ from "jquery";
import "../index/common.js";
import "./index.less";
import "../index/index.less";
import "../expert_service/index.less";
import "../index/index.js";
import "../ai_service/index.less";

$(function(params) {
  // $(".robot-banner").mousemove(function(evt) {
  //   var x = 0,
  //     y = 0;
  //   const timer = setTimeout(() => {
  //     var moveX = (evt.clientX - x) / 100 + "px";
  //     var moveY = (evt.clientY - y) / 50 + "px";
  //     x = evt.clientX;
  //     y = evt.clientY;
  //     console.log(moveX, moveY);
  //     $(".robot-banner .banner-img img").css({
  //       transform: "translateX(" + moveX + ") translateY(" + moveY + ") "
  //     });
  //     clearTimeout(timer);
  //   }, 100);
  // });

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
  // 会话一次显示动画
  $(".move-dialog-img").css({
    opacity: "0"
  });
  let hadMove = [];
  $(window).scroll(function() {
    moveimg();
  });
  moveimg();

  function moveimg() {
    const scrollY = $(window).scrollTop();
    const clientHeight = document.documentElement.clientHeight;
    $(".dialog-img").each(function() {
      const imgPosition = $(this)[0].offsetTop;
      const height = $(this).height();
      console.log(scrollY, imgPosition, clientHeight, height);
      console.log(scrollY - imgPosition + clientHeight - height);
      if (scrollY - imgPosition + clientHeight - height > -150) {
        const index = $(".dialog-img").index($(this));
        if (hadMove.includes(index)) {
        } else {
          hadMove.push(index);
          const moveDialog = $(this).find(".move-dialog-img");
          moveDialog.each(function(v) {
            const $this = $(this);
            console.log(v);
            const top = Number($this.css("top").replace("px", "")) + 200;
            $this.css({ top: top + "px" });
            //   console.log(top);
            setTimeout(() => {
              $this.css({ opacity: "1", top: top - 200 + "px" });
              if (index == 2 && v == 4) {
                $(".dialog-img")
                  .eq(2)
                  .find("img")
                  .css({
                    opacity: "0"
                  });
                $(".dialog-img")
                  .eq(2)
                  .find("img")
                  .eq(5)
                  .css({
                    opacity: "1"
                  });
              }
            }, (v + 1) * 300);
          });
        }
      }
    });
  }
});
