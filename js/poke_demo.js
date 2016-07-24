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


getPokes = function (lat,lng){
	$.ajax({
	url: "http://127.0.0.1:5000/",
	dataType: 'json',
	data: { lat: lat, lng: lng },
	success: function(data){
		var obj=data;
		console.dir(obj);
		var cells = obj.responses.GET_MAP_OBJECTS.map_cells;


		$("#pokeList tbody").html("");
		cells.forEach(function(cell){
			if("catchable_pokemons" in cell){
				cell.catchable_pokemons.forEach(function(pokemon){
					var newRowS = '<tr id="'+pokemon.encounter_id+'">\
									<td><div class="pokeface"></div></td>\
									<td><span></span></td>\
									<td><br>'+calcDist(lat,lng,pokemon.latitude,pokemon.longitude)+'</td>\
									<td><br>'+(new Date(pokemon.expiration_timestamp_ms)).toLocaleTimeString( )+'</br><br>'+toMS((pokemon.expiration_timestamp_ms -Date.now()))+'</br></td>\
							   </tr>';
					 $("#pokeList tbody").append(newRowS);
					$("#"+pokemon.encounter_id+" .pokeface").pokemonImgId(pokemon.pokemon_id);
					$("#"+pokemon.encounter_id+" span:eq(0)").pokemonLabelId(pokemon.pokemon_id);
					console.log(pokemon.encounter_id+":"+pokemon.pokemon_id);
				});
			}
			
		});
	},
	error: function(data,e,e1){
		console.dir(data);
		console.dir(e);
		console.dir(e1);
	},
	complete: function(data){
		//console.dir(data);
	}
});
}

//navigator.geolocation.getCurrentPosition(getPokes);
setInterval(function (){
	getPokes(9.933950, -84.073295);
	//navigator.geolocation.getCurrentPosition(getPokes);
}
,10000);