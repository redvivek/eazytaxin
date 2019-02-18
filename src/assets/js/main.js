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

// $( '.triggerScrollingTab' ).click( function( e ) {
//   alert(1);
//     e.preventDefault();
//     triggerScrollingTab.trigger( 'click' );
// });

 // function triggerScrollingTab(){
  // $('.scrollTabs:first').scrollingTabs({
  //   // tabs: tabs,
  //   bootstrapVersion: 4,
  //   // scrollToActiveTab: true,
  //   //tabs: myTabs,
  //   leftArrowContent: ['<div class="scrtabs-tab-scroll-arrow scrtabs-tab-scroll-arrow-left"><i class="fas fa-angle-left"></i></div>'].join(''),
  //   rightArrowContent: ['<div class="scrtabs-tab-scroll-arrow scrtabs-tab-scroll-arrow-right"><i class="fas fa-angle-right"></i></div>'].join('')
  // });  
  // $('.steps').scrollingTabs('scrollToActiveTab');


  // $('.scrollTabs')
  //       .scrollingTabs()
  //       .on('ready.scrtabs', function() {
  //         $('.tab-content').show();
  //       });



// }
// triggerScrollingTab(); 
 
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





var duration   = 500,
    transition = 200;
$( ".reviewChart" ).each(function( index, d ) {
  var ele = $(d);
  var id = ele.attr('id');
  drawDonutChart(
    '#'+id,
    ele.data('donut'),
    150,
    150,
    ".35em"
  );
});

function drawDonutChart(element, percent, width, height, text_y) {
  width = typeof width !== 'undefined' ? width : 150;
  height = typeof height !== 'undefined' ? height : 150;
  text_y = typeof text_y !== 'undefined' ? text_y : "-.10em";

  var dataset = {
        lower: calcPercent(0),
        upper: calcPercent(percent)
      },
      radius = Math.min(width, height) / 2,
      pie = d3.layout.pie().sort(null),
      format = d3.format(".0%");

  var arc = d3.svg.arc()
        .innerRadius(radius - 10)
        .outerRadius(radius);

  var svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var path = svg.selectAll("path")
        .data(pie(dataset.lower))
        .enter().append("path")
        .attr("class", function(d, i) { return "color" + i })
        .attr("d", arc)
        .each(function(d) { this._current = d; }); // store the initial values

  var text = svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", text_y);

  if (typeof(percent) === "string") {
    text.text(percent);
  }
  else {
    var progress = 0;
    var timeout = setTimeout(function () {
      clearTimeout(timeout);
      path = path.data(pie(dataset.upper)); // update the data
      path.transition().duration(duration).attrTween("d", function (a) {
        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        var i  = d3.interpolate(this._current, a);
        var i2 = d3.interpolate(progress, percent)
        this._current = i(0);
        return function(t) {
          text.text( format(i2(t) / 100) );
          return arc(i(t));
        };
      }); // redraw the arcs
    }, 200);
  }
};

function calcPercent(percent) {
  return [percent, 100-percent];
};

