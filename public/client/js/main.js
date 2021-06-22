// slide
$('.slider-one')
   .not(".slick-inialized")
   .slick({
      dots: true,
      autoplay: true,
      autoplaySpeed: 3000,
      prevArrow: ".site-slider .slider-btn .prev",
      nextArrow: ".site-slider .slider-btn .next",
   });

// catagory slide
$('.slider-two')
   .not(".slick-inialized")
   .slick({
      prevArrow: ".site-slider-two .prev",
      nextArrow: ".site-slider-two .next",
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
         {
            breakpoint: 1024,
            settings: {
               slidesToShow: 4,
               slidesToScroll: 1,
               prevArrow: ".site-slider-two .prev",
               nextArrow: ".site-slider-two .next",
            }
         },
         {
            breakpoint: 800,
            settings: {
               slidesToShow: 3,
               slidesToScroll: 1,
               prevArrow: ".site-slider-two .prev",
               nextArrow: ".site-slider-two .next",
            }
         },
         {
            breakpoint: 600,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 1,
               prevArrow: ".site-slider-two .prev",
               nextArrow: ".site-slider-two .next",
            }
         }
      ]
   });

