/*
 * js helpers:
 *
 * handleHeaderBackground() - make header background transparent
 * handleInsideHeaderBackground() - apply header background
 * handleSmoothScroll() - add smooth scroll on menu items click on home page
 * handleFloatingLabels() - handle the wave.js floating labels
 *
 */
declare var $:any;

export function handleHeaderBackground(){
    //console.log("Home Header Top Init");
    $("body").removeClass("scrolled");
    $("#header").addClass("no-bg");
}

export function handleInsideHeaderBackground(){
    //console.log("Insider Header");
    $("body").addClass("scrolled");
    $("#header").removeClass("no-bg");
}

export function makeSelectedMenuActiveProp(topscroll,offsettop){
  // Cache selectors
  var lastId,
  topMenu = $("#header"),
  topMenuHeight = topMenu.outerHeight()+15,
  // All list items
  menuItems = topMenu.find("a"),
  // Anchors corresponding to menu items
  scrollItems = menuItems.map(function(){
      var item = $(this).attr("href");
      if(item != undefined){
        if (item.length) { return item; }
      }
  });

  // Bind click handler to menu items
  // so we can get a fancy scroll animation
  menuItems.click(function(e){
    //alert($(this).attr("href").offset());
    //var href = $(this).attr("href"),
      //  offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight - 41;
    $('html, body').stop().animate({ 
        scrollTop: this.offsetTop
    }, 300);
    e.preventDefault();
  });

  // Get container scroll position
  var fromTop = topscroll+topMenuHeight;
    
  // Get id of current scroll item
  var cur = scrollItems.map(function(){
      //console.log("From TOP "+fromTop);
      if (this.offsettop < fromTop) 
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
}

export function handleFloatingLabels(Waves){
    Waves.attach('.waves-effect', ['waves-button', 'waves-float']);
    Waves.init();

    // Floating Label
    $('.floating-label .form-control').on('keyup change', function (e) {
    var input = $(e.currentTarget);
    if ($.trim(input.val()) !== '') {
        input.addClass('dirty').removeClass('static');
    } else {
        input.removeClass('dirty').removeClass('static');
    }
    });

    $('.floating-label .form-control').each(function () {
    var input = $(this);

    if ($.trim(input.val()) !== '') {
        input.addClass('static').addClass('dirty');
    }
    });
}


export function formSticky(){
  //SCRIPT FOR THE STICKY BUTTONS AT THE BOTTOM
  $(document).ready(function () {
      var buttonDiv = $('.stickyFooterForm');
      if (!buttonDiv.length) return;

      var width = $(window).width();
      var divHeight = buttonDiv.outerHeight();
      var isFakeDivAppended = 1;
      var isStickyFooterStuck;

        //console.log(buttonDiv);
        //console.log(width);

      function createDeleteFakeDiv(isStickyFooterStuck) {
          if ((isStickyFooterStuck === 1) && (isFakeDivAppended === 1)) {
              $("<div class='fake span-24'></div>").insertAfter(".affix");
              $('.fake').css({ 'height': divHeight, 'display': 'block' });
              isFakeDivAppended = 0;
          } else if (isStickyFooterStuck === 0) {
              $('.fake').remove();
              isFakeDivAppended = 1;
          }
      }

      function attachDetachStickyFooter() {
          var topOfElement = $("#footer").offset().top - 66; // 20 is to consider the  margin-top on the footer
          var bottomOfScreen = $(window).scrollTop() + window.innerHeight;
          if (bottomOfScreen >= topOfElement) {
              isStickyFooterStuck = 0;
              createDeleteFakeDiv(isStickyFooterStuck);
              buttonDiv.removeClass('affix');
          }
          else {
              buttonDiv.addClass('affix');
              buttonDiv.css({ "display": "block" });
              isStickyFooterStuck = 1;
              createDeleteFakeDiv(isStickyFooterStuck);
          }
      }

              attachDetachStickyFooter();

              $(document).on('change', '.investmentSection', attachDetachStickyFooter);

              $(window).scroll(function () {
                  width = $(window).width();
                  if (width > 700) {
                      attachDetachStickyFooter();
                  }
                  else {
                      buttonDiv.removeClass('affix');
                      isStickyFooterStuck = 0;
                      createDeleteFakeDiv(isStickyFooterStuck);
                  }
              });
  });
}

export function navbarToggle(){
  $(".navbar-toggler").click(function(){
    $(this).parents('.navbar').toggleClass('navbar-open');
  });
}
/* export function correctHeight() {

  var pageWrapper = jQuery('#page-wrapper');
  var navbarHeight = jQuery('nav.navbar-default').height();
  var wrapperHeigh = pageWrapper.height();

  if (navbarHeight > wrapperHeigh) {
    pageWrapper.css("min-height", navbarHeight + "px");
  }

  if (navbarHeight < wrapperHeigh) {
    if (navbarHeight < jQuery(window).height()) {
      pageWrapper.css("min-height", jQuery(window).height() + "px");
    } else {
      pageWrapper.css("min-height", navbarHeight + "px");
    }
  }

  if (jQuery('body').hasClass('fixed-nav')) {
    if (navbarHeight > wrapperHeigh) {
      pageWrapper.css("min-height", navbarHeight + "px");
    } else {
      pageWrapper.css("min-height", jQuery(window).height() - 60 + "px");
    }
  }
} */

/* export function detectBody() {
  if (jQuery(document).width() < 769) {
    jQuery('body').addClass('body-small')
  } else {
    jQuery('body').removeClass('body-small')
  }
} */

/* export function smoothlyMenu() {
  if (!jQuery('body').hasClass('mini-navbar') || jQuery('body').hasClass('body-small')) {
    // Hide menu in order to smoothly turn on when maximize menu
    jQuery('#side-menu').hide();
    // For smoothly turn on menu
    setTimeout(
      function () {
        jQuery('#side-menu').fadeIn(400);
      }, 200);
  } else if (jQuery('body').hasClass('fixed-sidebar')) {
    jQuery('#side-menu').hide();
    setTimeout(
      function () {
        jQuery('#side-menu').fadeIn(400);
      }, 100);
  } else {
    // Remove all inline style from jquery fadeIn function to reset menu state
    jQuery('#side-menu').removeAttr('style');
  }
} */
