

// Header
headerScrollJs();

function headerScrollJs() {
    var scroll = $(window).scrollTop();
    if (scroll >= 500) {
      // alert(1);
      $("body").addClass("scrolled");
      $("#header").removeClass("no-bg");
    } else {
      // alert(2);
      $("body").removeClass("scrolled");
      $("#header").addClass("no-bg");
    }
};


