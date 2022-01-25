$(document).ready(function () {
  let allSlides = [];
  let likeCounter = $('<p class="footer_like-counter"></p>')
  function getNewUrl (missSlides, countNextSlides) {
      return 'https://private-anon-9390dbdbde-grchhtml.apiary-mock.com/slides?offset=' + missSlides + '&limit=' + countNextSlides;
  }

  function likeUrl (id) {
    return 'https://private-anon-86a2375402-grchhtml.apiary-mock.com/slides/' + id +'/like'
  }

  function ajaxRequest(url, method, data, handler = function() {}) {
      $.ajax({
          url: url,
          data: data,
          cotentType: 'application/json; charset=UTF-8',
          method: method,
          headers: {"Content-type": "application/json"},
          success: function(response) {
              handler(response);
              console.log(response);
          }
      });
    }
    
    function displayTasks(dataFromServer) {
      $(dataFromServer).each(function (i) {
          let item = dataFromServer[i];
          let slide = $('<div></div>').addClass('swiper-slide').attr('id', item.id).css('background-image', 'url(' + item.imgUrl + ')').attr('data-likeCnt', item.likeCnt);
          swiper.appendSlide(slide);
          if($('.swiper-slide-active')[0].id == item.id) {
            $('.footer_like-countContainer').append(likeCounter)
            $(likeCounter).text(item.likeCnt);
          }
      });
  }

  let swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    observe: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  $('#footer_like-btn').click(function() {
    const id = $('.swiper-slide-active').attr('id');
    let likeNumber = $('.swiper-slide-active').attr(('data-likeCnt'));
    let likeCnt = (++likeNumber);
    console.log(likeCnt);
    let like = {
      id: id,
      likeCnt: likeCnt
    }
    ajaxRequest(likeUrl(id), 'POST', like, ololo);
  })

  function ololo(response) {
    console.log(response.title);
  }
  
  function getSlides(response) {
    allSlides = response.data;
    $('.swiper-button-next').click(function(){
      $(likeCounter).text($('.swiper-slide-active').attr('data-likeCnt'));
    })
    $('.swiper-button-prev').click(function(){
      $(likeCounter).text($('.swiper-slide-active').attr('data-likeCnt'));
    })
    displayTasks(allSlides);
  }

  $('.swiper-button-next').click(function(){
      if (swiper.isEnd && swiper.realIndex == 2) {
        showSlides(3, 3);
      }
      if (swiper.isEnd && swiper.realIndex == 5) {
        showSlides(6, 3);
      }
  })

  function showSlides(missData, countData) {
    ajaxRequest(getNewUrl(missData, countData), 'GET', null, getSlides);
  }

  showSlides(0, 3);
});