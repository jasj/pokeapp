$.support.cors = true;
Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

function toMS(t){
	ts = t/1000;
	var m= "0"+parseInt(ts/60);
	var s= "0"+parseInt(ts%60);
	return m.substr(-2)+":"+s.substr(-2)
}

function calcDist(lat1,lon1,lat2,lon2){
	console.log(lat2);
	var R = 6371; // m 
	//has a problem with the .toRad() method below.
	var x1 = lat2-lat1;
	var dLat = x1.toRad();  
	var x2 = lon2-lon1;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
					Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
					Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 
	
	return parseFloat(d*1000).toFixed(2);;
}

function foundPokemon(lat,lng,pokemon){
	var newRowS = '<tr id="'+pokemon.encounter_id+'" pkdex="'+pokemon.pokemon_id+'" goto="Map" fx="DrawRoute" param="'+pokemon.pokemon_id+','+pokemon.expiration_timestamp_ms+','+lat+','+lng+','+pokemon.latitude+','+pokemon.longitude+'">\
									<td><div class="pokeface"></div></td>\
									<td><br><span></span></br></td>\
									<td><br>'+calcDist(lat,lng,pokemon.latitude,pokemon.longitude)+'</td>\
									<td><br>'+(new Date(pokemon.expiration_timestamp_ms)).toLocaleTimeString( )+'</br><br><time end="'+pokemon.expiration_timestamp_ms+'">'+toMS((pokemon.expiration_timestamp_ms -Date.now()))+'</time></br></td>\
							   </tr>';
					 $("#pokeList tbody").append(newRowS);
					$("#"+pokemon.encounter_id+" .pokeface").pokemonImgId(pokemon.pokemon_id);
					$("#"+pokemon.encounter_id+" span:eq(0)").pokemonLabelId(pokemon.pokemon_id);
					console.log(pokemon.encounter_id+":"+pokemon.pokemon_id);
}


getPokes = function (lat,lng){
	$.ajax({
	url: "http://192.168.1.3:5000/",
	dataType: 'jsonp',
	crossDomain : true,
	data: { lat: lat, lng: lng },
	success: function(data){
		
		var obj=data;
		console.dir(obj);
		var cells = obj.responses.GET_MAP_OBJECTS.map_cells;

		
		$("#pokeList tbody").html("");
		cells.forEach(function(cell){
			if("catchable_pokemons" in cell){
				cell.catchable_pokemons.forEach(function(pokemon){
					foundPokemon(lat,lng,pokemon)
				});
			}
			if("forts" in cell){
				cell.forts.forEach(function(fort){
					if("lure_info" in fort){
						var pokemon = {
							encounter_id = fort.lure_info.fort_id,
							pokemon_id = fort.lure_info.active_pokemon_id,
							latitude = fort.latitude,
							longitude = fort.longitude,
							expiration_timestamp_ms = fort.lure_info.lure_expires_timestamp_ms
						};
						foundPokemon(lat,lng,pokemon);
					}
				});
			}
			
		});
	},
	error: function(data,e,e1){
		console.dir(data);
		console.dir(JSON.stringify(e));
		console.dir(JSON.stringify(e1));
	},
	complete: function(data){
		console.dir("ok compleate");
	}
});
}

geolocationSuccess = function(location){
	getPokes(location.coords.latitude, location.coords.longitude );
}

//navigator.geolocation.getCurrentPosition(getPokes);
setInterval(function (){
	 navigator.geolocation.getCurrentPosition(geolocationSuccess);
}
,10000);

setInterval(function(){
	var tnow= Date.now();
	$("time").each(function(){
		$(this).html(toMS($(this).attr("end")-tnow));
	});
}
,1000);




function initMap() {
  var chicago = {lat: 41.85, lng: -87.65};
  var indianapolis = {lat: 39.79, lng: -86.14};

  var map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: chicago,
    scrollwheel: false,
    zoom: 7
  });

  var directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });

  // Set destination, origin and travel mode.
  var request = {
    destination: indianapolis,
    origin: chicago,
    travelMode: google.maps.TravelMode.DRIVING
  };

  // Pass the directions request to the directions service.
  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // Display the route on the map.
      directionsDisplay.setDirections(response);
    }
  });
}

function DrawRoute(pkId,t,olat,olng,dlat,dlng){
	$('footer .pokeface').pokemonImgId(pkId);
	$('footer time').attr("end",t)
	var origin = {lat: olat, lng: olng};
	var destination = {lat: dlat, lng: dlng};

  var map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: origin,
    scrollwheel: false,
    zoom: 7
  });

  var directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });

  // Set destination, origin and travel mode.
  var request = {
    destination: destination,
    origin: origin,
    travelMode: google.maps.TravelMode.DRIVING
  };

  // Pass the directions request to the directions service.
  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // Display the route on the map.
      directionsDisplay.setDirections(response);
    }
  });
}
