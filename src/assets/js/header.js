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

$(".mainMenutoggler").click(function() {
    $('.mainMenuList').toggleClass("show");
    $('.modal-backdrop').fadeToggle("fast");
  });
  
  $(document).delegate('.modal-backdrop', "click", function (e) { 
    $('.mainMenuList').removeClass("show");
    $('.modal-backdrop').fadeOut("fast");
  });
  
  $(document).delegate('.sidebartoggler', "click", function (e) { 
    $('body').toggleClass("left-sidebar-hide");
  });