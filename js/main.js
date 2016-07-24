
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