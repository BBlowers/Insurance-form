var placeSearch, autocomplete;

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),{types:['address']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
  autocomplete.setComponentRestrictions({country:'GB'});
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  console.info(place);

  var parsed_address = [];


  // Get Address Components
  for (var i = 0; i < place.address_components.length; i++) {
    parsed_address[place.address_components[i].types[0]] = place.address_components[i].long_name;
  }

  console.info(parsed_address);

  var street_addr = '';
  if (parsed_address['premise']){
    street_addr += parsed_address['premise'] + ', ';
  }
  if (parsed_address['street_number']){
    street_addr += parsed_address['street_number'] + ' ';
  }
  if (parsed_address['route']){
    street_addr += parsed_address['route'];
  }

  var city_addr = '';
  if (parsed_address['locality']){
    city_addr = parsed_address['locality'];
  }

  var postcode_addr = '';
  if (parsed_address['postal_code']){
    postcode_addr = parsed_address['postal_code'];
  } else if (parsed_address['postal_code_prefix']) {
    postcode_addr = parsed_address['postal_code_prefix'];
  }

  document.getElementById('street_addr').value = street_addr;
  document.getElementById('city_addr').value = city_addr;
  document.getElementById('postcode_addr').value = postcode_addr;
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}