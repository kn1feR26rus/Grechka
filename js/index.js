$(document).ready(function () {
  let allSlides = [];
  let likeCounter = $('<p class="footer_like-counter"></p>');

  function getNewUrl(missSlides, countNextSlides) {
    return (
      "https://private-anon-9390dbdbde-grchhtml.apiary-mock.com/slides?offset=" +
      missSlides +
      "&limit=" +
      countNextSlides
    );
  }

  function likeUrl(id) {
    return (
      "https://private-anon-86a2375402-grchhtml.apiary-mock.com/slides/" +
      id +
      "/like"
    );
  }

  function ajaxRequest(url, method, data, handler = function () {}) {
    $.ajax({
      url: url,
      data: data,
      cotentType: "application/json; charset=UTF-8",
      method: method,
      headers: { "Content-type": "application/json" },
      success: function (response) {
        handler(response);
      },
      error: function () {
        $("#swiper-slide")
          .css("background", "#CFCFCF")
          .css("backvround-image", "url(../pic/err.svg)");
        let errPic = $("img").css("background-image", "ulr(../pic/ERROR.svg)");
        $("#swiper-slide").append(errPic);
      },
    });
  }

  function displayTasks(dataFromServer) {
    $(dataFromServer).each(function (i) {
      let item = dataFromServer[i];
      let slide = $("<div></div>")
        .addClass("swiper-slide")
        .attr("id", item.id)
        .css("background-image", "url(" + item.imgUrl + ")")
        .attr("data-likeCnt", item.likeCnt)
        .attr("data-desc", item.desc);
      swiper.appendSlide(slide);
      if ($(".swiper-slide-active")[0].id == item.id) {
        $(".footer_like-countContainer").append(likeCounter);
        $(likeCounter).text(item.likeCnt);
      }
    });
  }

  let swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    observe: true,
    allowTouchMove: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  $("#footer_like-btn").click(function () {
    let id = $(".swiper-slide-active").attr("id");
    let likeCnt = $(".swiper-slide-active").attr("data-likeCnt");

    $("#popup_text").text($(".swiper-slide-active").attr("data-desc"));
    $("#popup_text").text();

    ajaxRequest(likeUrl(id), "POST", null, addPopupTitle);

    $("#popup").show();
    $("#swiper-button-next, #swiper-button-prev").hide();
    $(".swiper-slide-active").css("opacity", 0.5);
    likeCnt = +likeCnt + 1;
    $(".swiper-slide-active").attr("data-likeCnt", likeCnt);
    likeCounter.text(likeCnt);
  });

  $("#popup_close, .swiper-wrapper, .header").click(function () {
    $("#popup").hide();
    $("#swiper-button-next, #swiper-button-prev").show();
    $(".swiper-slide-active").css("opacity", 1);
  });

  function addPopupTitle(response) {
    $("#popup_tnx").text(response.title);
    $("#popup_desc").text(response.desc);
  }

  function getSlides(response) {
    allSlides = response.data;
    $(".swiper-button-next").click(function () {
      $(likeCounter).text($(".swiper-slide-active").attr("data-likeCnt"));
    });

    $(".swiper-button-prev").click(function () {
      const id = $(".swiper-slide-active").attr("id");
      const currentTitle = $(".swiper-slide-active");
      $(likeCounter).text($(".swiper-slide-active").attr("data-likeCnt"));

      $("#header_title").text(0 + id);
      if (currentTitle[0].id == 0) {
        $("#header_title").text("The Razorite");
      }
    });
    displayTasks(allSlides);
  }

  $(".swiper-button-next").click(function () {
    if (swiper.isEnd && swiper.realIndex == 2) {
      showSlides(3, 3);
    }
    if (swiper.isEnd && swiper.realIndex == 5) {
      showSlides(6, 3);
    }
    const id = $(".swiper-slide-active").attr("id");
    $("#header_title").text(0 + id);
  });

  function showSlides(missData, countData) {
    ajaxRequest(getNewUrl(missData, countData), "GET", null, getSlides);
  }

  showSlides(0, 3);
});
