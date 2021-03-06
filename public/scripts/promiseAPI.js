
  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
  $(function () {
  var map;
  var service;
  var infowindow;
  let markers = [];

  function initMap() {
    var sydney = new google.maps.LatLng(-33.867, 151.195);

    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(
      document.getElementById('map'), {
        center: sydney,
        zoom: 15
      });

    var request = {
      query: '<%= city %>',
      fields: ['name', 'geometry'],
    };

    service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }

        map.setCenter(results[0].geometry.location);
      }
    });
  }

  function createMarker(place) {
    let marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      draggable: true,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }


  function addMarker(map) {
    let lat = map.getCenter().lat();
    let lng = map.getCenter().lng();
    marker = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng,
      },
      title: 'ALEX',
      description: 'ALEX',
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      id: 'bica'
    });
    markers.push(marker);
    marker.addListener('click', toggleBounce);
    const contentString =
            '<div id="marker-form">'+
              '<form class="marker-form" action="/alex" method="POST">'+
                'Marker Title'+
                '<input type="text" class="marker-title" name="title" placeholder="Title">'+
                'Marker Description'+
                '<input type="text" class="marker-desc" name="description" placeholder="Description">'+
                'Image Url'+
                '<input type="text" class="marker-img" name="imgURL" placeholder="image URL">'+
                '<button class="" type="submit">submit</button>'+
              '</form>'+
            '</div>';
    const infowindow = new google.maps.InfoWindow();

    // marker.addListener('click', toggleBounce);
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent(contentString);
        infowindow.open(map, this);
    })


  };

  const toggleBounce = function () {
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    } else {
      this.setAnimation(google.maps.Animation.BOUNCE);
    }
  };

  const clearMarker = function (markers) {
    for (let i = 1; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  };
  const createMap = function (markers) {
    let markerData = [];
    for (let i = 0; i < markers.length; i++) {
      let marker = {};
      marker['location'] = {
        lat: markers[i].getPosition().lat(),
        lng: markers[i].getPosition().lng(),
      };
      markerData.push(marker);
    }
    console.log(JSON.stringify(markerData));
    $.ajax({
      type: 'POST',
      data: JSON.stringify(markerData),
      // data: markerData,
      contentType: 'application/json',
      url: '/endpoint',
      success: function (data) {
        console.log('success');
      }
    });
  }
  initMap();
});




