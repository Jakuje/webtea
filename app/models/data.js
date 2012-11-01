function webTea(){}

webTea.Data = ({
	initialize: function(){
		
		if( this.data !== undefined ){
			Mojo.Log.error("Data již inicializovana");
			return;
		}
		
		this.cookieData = new Mojo.Model.Cookie('comDta3teamWebtea');
		data = this.cookieData.get();
		if ( data == undefined ) {
			this.time =  5;
			this.tea = 3;
			this.autostart = false;
			this.theme = "tea";
			this.tone = "/media/internal/ringtones/Flurry.mp3";
			this.blockscreentimeout = false;
		} else {
			if (data.time == undefined) {
				this.time = 5;
			} else {
				this.time = data.time;
			}
			if (data.tea == undefined){
				this.tea = 3;
			}  else {
				this.tea = data.tea;
			} 
			if (data.autostart == undefined){
				this.autostart = false;
			}  else {
				this.autostart = data.autostart;
			}
			if (data.theme == undefined){
				this.theme = "tea";
			}  else {
				this.theme = data.theme;
			}
			if (data.tone == undefined){
				this.tone = "/media/internal/ringtones/Flurry.mp3";
			}  else {
				this.tone = data.tone;
			}
			if (data.blockscreentimeout == undefined){
				this.blockscreentimeout = false;
			}  else {
				this.blockscreentimeout = data.blockscreentimeout;
			}
		}
		this.theme_disabled = true;
	},
	
	storeCookie: function(){
		this.cookieData.put( {
	time: this.time,
	tea: this.tea,
	autostart: this.autostart,
	theme: this.theme,
	tone: this.tone,
	blockscreentimeout: this.blockscreentimeout
		} );
	}
});
