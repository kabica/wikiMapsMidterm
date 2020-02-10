function nav() {
  $('.nav-menu').on('click', function() {
    $('.menu').slideToggle();
  })

  $('.auth').on('click', function() {
    $(this).slideToggle();
  })
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

$( document ).ready(function() {
  nav();
  openForm();
  closeForm();
  // $('.auth').hide();

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
