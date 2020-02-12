$(document).ready(function () {
  $mapContainer = $("#mapCollection")

  const empty = function () {
    $mapContainer.empty();
    $mapContainer.append('alex')
  }

  $('#create').on('click', function () {
    empty();
  })

})



