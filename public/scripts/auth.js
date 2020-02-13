$( document ).ready(function() {
  $('#auth-open').on('click', function() {
    $('#auth-drop-down').slideToggle();
  });

  $('.auth-switch').on('click', function() {
    const form = $(this).parent();
    form.hide();
    form.siblings().show();
  });
});
