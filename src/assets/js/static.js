// Home Page Banner Slider
//Init the carousel
initSlider();

function initSlider() {
  $(".owl-carousel").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    onInitialized: startProgressBar,
    onTranslate: resetProgressBar,
    onTranslated: startProgressBar
  });
}

function startProgressBar() {
  // apply keyframe animation
  $(".slide-progress").css({
    width: "100%",
    transition: "width 5000ms"
  });
}

function resetProgressBar() {
  $(".slide-progress").css({
    width: 0,
    transition: "width 0s"
  });
}

