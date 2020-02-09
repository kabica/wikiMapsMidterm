function nav() {
  $('.nav-menu').on('click', function() {
    $('.menu').slideToggle();
  })
}

$( document ).ready(function() {
  nav();
});
