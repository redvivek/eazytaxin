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

