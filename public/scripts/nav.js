function myFunction() {
  $('.menu').hide();

  $('.nav-menu').on('click', function() {
    $('.menu').slideToggle();
  })
}

$( document ).ready(function() {
  myFunction();
});
