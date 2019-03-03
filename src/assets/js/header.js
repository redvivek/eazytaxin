// Header
headerScrollJs();

function headerScrollJs() {
    var scroll = $(window).scrollTop();
    if (scroll >= 500) {
      //alert(1);
      $("body").addClass("scrolled");
      $("#header").removeClass("no-bg");
    } else {
      //alert(2);
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

  $( ".scrollLink" ).click(function( event ) {
    event.preventDefault();
    $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top }, 500);
    return false;
  });




  // Cache selectors
  var lastId,
      topMenu = $("#header"),
      topMenuHeight = topMenu.outerHeight()+15,
      // All list items
      menuItems = topMenu.find("a"),
      // Anchors corresponding to menu items
      scrollItems = menuItems.map(function(){
        var item = $($(this).attr("href"));
        if (item.length) { return item; }
      });

  // Bind click handler to menu items
  // so we can get a fancy scroll animation
  menuItems.click(function(e){
    //alert($(this).attr("href").offset());
    var href = $(this).attr("href"),
        offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight - 41;
    $('html, body').stop().animate({ 
        scrollTop: offsetTop
    }, 300);
    e.preventDefault();
  });

  // Bind to scroll
  $(window).scroll(function(){
     // Get container scroll position
     var fromTop = $(this).scrollTop()+topMenuHeight;
     
     // Get id of current scroll item
     var cur = scrollItems.map(function(){
       if ($(this).offset().top < fromTop)
         return this;
     });
     // Get the id of the current element
     cur = cur[cur.length-1];
     var id = cur && cur.length ? cur[0].id : "";
     
     if (lastId !== id) {
         lastId = id;
         // Set/remove active class
         menuItems
           .parent().removeClass("active")
           .end().filter("[href='#"+id+"']").parent().addClass("active");
     }                   
  });