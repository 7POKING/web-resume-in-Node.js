    let items = document.querySelectorAll('.carousel .carousel-item')
    console.log(items)
    items.forEach((el) => {
      const minPerSlide = 4
      let next = el.nextElementSibling
      for (var i = 1; i < minPerSlide; i++) {
        console.log(next)
        if (!next) {
          // wrap carousel by using first child
          next = items[0]
        }
        let cloneChild = next.cloneNode(true)
        el.appendChild(cloneChild.children[0])
        next = next.nextElementSibling
      }
    })


    // let carousel = document.querySelector('.carousel');
    // let carouselInner = document.querySelector('.carousel-inner');

    // let items = document.querySelectorAll('.carousel .carousel-item');
    // let totalItems = items.length;

    // let currentIndex = 0; // 当前轮播项的索引
    // const minPerSlide = 3; // 一次轮播多少项
    // const itemWidth = carousel.clientWidth / minPerSlide; // 单个轮播项的宽度

    // // 添加事件监听器，当轮播结束时执行
    // carousel.addEventListener('slid.bs.carousel', function () {
    //     currentIndex = (currentIndex + 1) % totalItems; // 更新当前索引
    // });

    // // 自动轮播
    // function slide() {
    //     // 计算下一个轮播项的索引
    //     let nextIndex = (currentIndex + minPerSlide) % totalItems;

    //     // 计算轮播的偏移量
    //     let offset = nextIndex * itemWidth;

    //     // 使用 Bootstrap 的 carousel 方法手动切换到下一个轮播项
    //     $('#carouselExample').carousel('next');

    //     // 移动轮播项以实现连续轮播
    //     carouselInner.style.transform = `translateX(-${offset}px)`;
    // }

    // // 设置定时器，每隔一段时间执行一次轮播
    // setInterval(slide, 2000); // 这里的 2000 是轮播间隔时间，可以根据需要调整

    // 初始化轮播
    // var myCarousel = new bootstrap.Carousel(document.getElementById('multiSlideCarousel'));
  
    // // 添加事件监听器（可选）
    // myCarousel.on('slide.bs.carousel', function (event) {
    //   // 这里可以添加在轮播滑动时执行的代码
    //   const multiSlideCarousel = document.getElementById("multiSlideCarousel");

    //   // 监听前进按钮点击事件
    //   const nextButton = multiSlideCarousel.querySelector(".carousel-control-next");
    //   nextButton.addEventListener("click", function () {
    //     multiSlideCarousel.querySelector(".carousel-inner").appendChild(
    //       multiSlideCarousel.querySelector(".carousel-inner .carousel-item:first-child")
    //     );
    //   });

    //   // 监听后退按钮点击事件
    //   const prevButton = multiSlideCarousel.querySelector(".carousel-control-prev");
    //   prevButton.addEventListener("click", function () {
    //     multiSlideCarousel.querySelector(".carousel-inner").insertBefore(
    //       multiSlideCarousel.querySelector(".carousel-inner .carousel-item:last-child"),
    //       multiSlideCarousel.querySelector(".carousel-inner .carousel-item:first-child")
    //     );
    //   });

    // });
  


    // document.addEventListener("DOMContentLoaded", function () {
    //     // 获取轮播元素
    //     const multiSlideCarousel = document.getElementById("multiSlideCarousel");

    //     // 监听前进按钮点击事件
    //     const nextButton = multiSlideCarousel.querySelector(".carousel-control-next");
    //     nextButton.addEventListener("click", function () {
    //       multiSlideCarousel.querySelector(".carousel-inner").appendChild(
    //         multiSlideCarousel.querySelector(".carousel-inner .carousel-item:first-child")
    //       );
    //     });

    //     // 监听后退按钮点击事件
    //     const prevButton = multiSlideCarousel.querySelector(".carousel-control-prev");
    //     prevButton.addEventListener("click", function () {
    //       multiSlideCarousel.querySelector(".carousel-inner").insertBefore(
    //         multiSlideCarousel.querySelector(".carousel-inner .carousel-item:last-child"),
    //         multiSlideCarousel.querySelector(".carousel-inner .carousel-item:first-child")
    //       );
    //     });
    //   });
