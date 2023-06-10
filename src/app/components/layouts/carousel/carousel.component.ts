import { Component, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
declare let $: any;
declare const bootstrap: any;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html'
})
export class CarouselComponent implements AfterViewInit {
  @ViewChild('myCarousel') myCarousel: ElementRef;
  intervalId: any;
  data = [
    { img: "https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img1.jpg", title: "Slide 1" },
    { img: "https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img2.jpg", title: "Slide 2" },
    { img: "https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img3.jpg", title: "Slide 3" },
    { img: "https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img3.jpg", title: "Slide 4" },
    { img: "https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img3.jpg", title: "Slide 5" },
    { img: "https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img3.jpg", title: "Slide 6" },
    { img: "https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img3.jpg", title: "Slide 7" },
    { img: "https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img3.jpg", title: "Slide 8" },
    { img: "https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img3.jpg", title: "Slide 9" },
    { img: "https://therichpost.com/wp-content/uploads/2021/05/bootstrap5-carousel-slider-img3.jpg", title: "Slide 10" },
  ];

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const controls = this.myCarousel.nativeElement.querySelectorAll('.carousel-control');
    controls.forEach((control: { addEventListener: (arg0: string, arg1: () => void) => void; dispatchEvent: (arg0: MouseEvent) => void; }) => {
      control.addEventListener('mouseover', () => {
        const interval = 1000;
        this.intervalId = setInterval(() => {
            control.dispatchEvent(new MouseEvent('click'));
          }, interval);
        });

      control.addEventListener('mouseout', () => {
        clearInterval(this.intervalId);
      });
    });


    let multipleCardCarousel = document.querySelector("#myCarousel");
    if (window.matchMedia("(min-width: 768px)").matches) {
      let carousel = new bootstrap.Carousel(multipleCardCarousel, {
        interval: false,
      });
      console.log(carousel);
      let carouselWidth = $(".carousel-inner")[0].scrollWidth;
      let cardWidth = $(".carousel-item").width();
      let scrollPosition = 0;
      $("#myCarousel .carousel-control-next").on("click", function () {
        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $("#myCarousel .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
      $("#myCarousel .carousel-control-prev").on("click", function () {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          $("#myCarousel .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
    } else {
      $(multipleCardCarousel).addClass("slide");
    }
    
  }
}

