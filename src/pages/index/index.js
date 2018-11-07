import $ from "jquery";
import _ from "underscore";
import store from "store";
import "../../utils/jquery.XDomainRequest.js";
import "../../utils/jquery.waypoints.js";
import "../../utils/jquery.counterup.js";
import { checkPhone } from "./rightBar.js";
import "./common.js";
import "./index.less";

$(() => {
  // 首屏箭头，点击切换到第二屏
  $(".scrollScreenBtn ").on("click", () => {
    let scrollTop =
      document.documentElement.getBoundingClientRect().height -
      $(".m-topBar").height() -
      100;
    $(document.documentElement).animate({ scrollTop }, 300);
    $(document.body).animate({ scrollTop }, 300);
  });

  // 对于首页，顶栏开始全透明， 滚动开始后设置透明度
  const $topBar = $(".m-topBar");
  const $sectionOne = $(".section-one");
  function onScroll() {
    const scrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop ||
      0;
    if (scrollTop > 0) {
      $topBar.addClass("onScroll");
      $(".scrollScreenBtn ").addClass("hide");
    } else {
      $topBar.removeClass("onScroll");
      $(".scrollScreenBtn ").removeClass("hide");
    }

    // 首屏滚动背景和内容视差动画
    // 内容渐隐
    /*const firstScreenHeight = window.innerHeight
    const bgRatio = 0.5
    const contentRatio = 1.2
    const scrollProgress = scrollTop / firstScreenHeight
    const $bgContainer = $sectionOne.find('.bgContainer')
    const $content = $sectionOne.find('.content')
    $bgContainer.css('top', bgRatio * scrollTop)
    $content.css('top', contentRatio * scrollTop).css('opacity', 1 - scrollProgress * contentRatio * 1)*/
  }
  onScroll();
  $(document).on("scroll", _.throttle(onScroll, 10));

  // 首屏背景图轮播
  let bgShow = 1;
  let bgCount = 2;
  function bgInterval() {
    let cur = bgShow;
    let next = (bgShow + 1) % bgCount || bgCount;
    bgShow = next;
    let curElem = $(`.section-one .bgContainer .bg${cur}`);
    let nextElem = $(`.section-one .bgContainer .bg${next}`);
    $(curElem).css({ opacity: 0 });
    $(nextElem).css({ opacity: 1 });

    setTimeout(bgInterval, 6000);
  }
  setTimeout(bgInterval, 6000);

  // 点击立即试用
  $(".section-one .tryUseBtn").click(params => {
    checkPhone($(".section-one .phoneInput"));
  });
  $(".tryout .tryUseBtn").click(() => {
    checkPhone($(".tryout .phoneInput"));
  });

  // 其他页面点击立即试用
  $(".banner-content .tryUseBtn").click(params => {
    checkPhone($(".banner-content .phoneInput"));
  });

  // 第二屏企业logo轮播
  let logoLine = 1;
  function logoInterval() {
    let cur = logoLine;
    let next = (logoLine + 1) % 3 || 3;
    // console.log(cur, next)
    logoLine = next;
    let curElem = $(
      `.section-two .companyLogosLine .animateContainer .line${cur}`
    );
    let nextElem = $(
      `.section-two .companyLogosLine .animateContainer .line${next}`
    );
    $(nextElem).css({ transition: "none", transform: "translateY(50px)" });
    setTimeout(() => {
      $(curElem).css({
        transition: "all ease 1s",
        transform: "translateY(-50px)"
      });
      $(nextElem).css({
        transition: "all ease 1s",
        transform: "translateY(0)"
      });
    }, 20);

    setTimeout(logoInterval, 3000);
  }
  setTimeout(logoInterval, 3000);

  // counterUp 效果
  let setCounterUp = false;
  const getCount = function() {
    $.ajax({
      url: "//kdb.xiaoduoai.com/stat-api/log-count.php",
      crossDomain: true,
      type: "GET",
      contentType: "application/json",
      dataType: "json",
      success(data) {
        let totalCount = (data && data.count) || 200000000;
        let count = totalCount.toString();
        while (/(\d+)(\d{3})/.test(count)) {
          count = count.replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
        }
        $(".messageTotalCount").text(count);

        if (!setCounterUp) {
          setCounterUp = true;
          $(".countNum").counterUp({
            delay: 10,
            time: 1000,
            context: window
          });
        }
      }
    });
  };
  $(() => {
    getCount();
    const INTERVAL = 1.5 * 1000;
    setInterval(getCount, INTERVAL);
  });
});

// map动画
$(params => {
  setTimeout(() => {
    $(".circular").addClass("animate");
  }, 1000);
  setTimeout(() => {
    $(".two-cricular").addClass("animate");
  }, 2000);
});
// faq
$(() => {
  $(".robot-faq-img .img-btn button").click(function(params) {
    let index = $(this).index();
    if (index) {
      $(".robot-faq-img .img-area").css({ "margin-left": "-100%" });
    } else {
      $(".robot-faq-img .img-area").css({ "margin-left": "0%" });
    }

    $(this).addClass("active");
    $(this)
      .siblings()
      .removeClass("active");
  });

  // 设置是否显示语言
  $(() => {
    const href = window.location.href;
    if (href.indexOf("index") > -1 || window.location.pathname == '/' ) {
      $(".m-topBar .header-line").remove();
    } else {
      $(".m-topBar .language").remove();
    }
  });
});
