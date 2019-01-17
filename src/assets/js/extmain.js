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
