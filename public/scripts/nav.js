function nav() {
  $('.nav-menu').on('click', function() {
    $('.menu').slideToggle();
  })
}

$( document ).ready(function() {
  nav();

  // Had to force the menu to show or hide on resize
  $(window).on('resize', function() {
    if ($(window).width() >= 1024) {
      $('.menu').css('display', 'flex');
      console.log('nonyabuisness')
    } else {
      if ($('.menu').css('display') == 'flex') {
        $('.menu').css('display', 'none');
      }
    }
  })
});
