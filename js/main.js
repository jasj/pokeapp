
jQuery.fn.extend({
	pokemonImgId: function(id) {
		var top= -parseInt((id-1)/25)*80;
		var left= -parseInt((id-1)%25)*80;
		return this.css({"background-position" : left+"px "+top+"px"});
   },
   pokemonLabelId: function(id){
	   return this.html(pokeList[id-1].name);
   }
});

$.fn.hasAttr = function(name) {  
   return this.attr(name) !== undefined;
};

$(document).on("click",'[goto]',function(){
	$("section.active").removeClass("active");
	$("section#"+$(this).attr("goto")).addClass("active");
	if($(this).hasAttr("fx")){
		eval($(this).attr("fx")+"("+($(this).hasAttr("param")?$(this).attr("param"):"")+")");
	}

});

$(document).on("click",'nav i',function(){
	$("nav i.active").removeClass("active");
	$(this).addClass("active");
});

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
   navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

