function myFunction() {
  // $('.menu').hide();

  $('.nav-menu').on('click', function() {
    $('.menu').slideToggle();
  })
  // $('.nav-icon').on('click', function() {
  //   $('.error-msg').slideUp();
  //   $('.new-tweet').slideToggle({complete: function() {
  //     $('.form-input').focus();
  //   }});
  // });

  // $(".menu").show();
  // var x = document.getElementById("myTopnav");
  // if (x.className === "topnav") {
  //   x.className += " responsive";
  // } else {
  //   x.className = "topnav";
  // }
}

$( document ).ready(function() {
  myFunction();
});
