$(document).ready(function () {
    const nextButton = $('#main-arrow-right');
    const prevButton = $('#main-arrow-left');
    const mainUrlrl = 'https://private-anon-9390dbdbde-grchhtml.apiary-mock.com/slides?offset=0&limit=3';
    let allSlides = [];
    let countSlides = 3;
    let missSlides = 0;
    function getNewUrl (missSlides, countNextSlides) {
        return 'https://private-anon-9390dbdbde-grchhtml.apiary-mock.com/slides?offset=' + missSlides + '&limit=' + countNextSlides;
    }

    function ajaxRequest(url, method, handler = function() {}) {
        $.ajax({
            url: url,
            method: method,
            success: function(response) {
                handler(response);
            }
        });
      }
      
      function displayTasks(dataFromServer) {
        $(dataFromServer).each(function (i) {
            let item = dataFromServer[i];
            let slide = $('<div></div>').addClass('swiper-slide').attr('id', item.id).css('background-image', 'url(' + item.imgUrl + ')');
            swiper.appendSlide(slide);
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
    
    function getSlides(response) {
      allSlides = response.data;
      displayTasks(allSlides);
      }
 
    $('.swiper-button-next').click(function(){
      console.log(swiper);
        if (swiper.isEnd && swiper.realIndex == 2) {
          showSlides(3, 3);
        }
        if (swiper.isEnd && swiper.realIndex == 5) {
          showSlides(6, 3);
        }
    })

    function showSlides(missData, countData) {
      ajaxRequest(getNewUrl(missData, countData), 'GET', getSlides);
    }

    showSlides(0, 3);
});