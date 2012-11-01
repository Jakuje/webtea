function PreferencesAssistant() {
}

PreferencesAssistant.prototype.setup = function() {

	this.setupAutostartWidget();
	
	this.setupThemeWidget();
	
	this.setupToneWidget();
	
	this.setupBlockScreenTimeoutWidget();
	
	//this.std_background = document.getElementsByClassName("palm-default")[0].style.backgroundPositionX;
	//document.getElementsByClassName("palm-default")[0].style.backgroundPositionX = "500px";
	/*Mojo.Animation.animateStyle(
		document.getElementsByClassName("palm-default")[0],
		'background-position-x',
		"linear",
		{from: "0", to: "-500", duration: 2}
		);*/
}

PreferencesAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}

PreferencesAssistant.prototype.setupAutostartWidget = function(){

	this.controller.setupWidget(
		"autostart",
		{
			trueLabel: $L("On"),
			falseLabel: $L("Off"),
			modelProperty: "autostart"
		},
		webTea.Data
	);
	Mojo.Event.listen(
		this.controller.get("autostart"),
		Mojo.Event.propertyChange,
		this.handleAutostart.bind(this)
	);

} // -----------------------------------------------------------------

PreferencesAssistant.prototype.setupBlockScreenTimeoutWidget = function(){

	this.controller.setupWidget(
		"blockscreentimeout",
		{
			trueLabel: $L("On"),
			falseLabel: $L("Off"),
			modelProperty: "blockscreentimeout"
		},
		webTea.Data
	);
	Mojo.Event.listen(
		this.controller.get("blockscreentimeout"),
		Mojo.Event.propertyChange,
		this.handleBlockscreentimeout.bind(this)
	);

} // -----------------------------------------------------------------

PreferencesAssistant.prototype.setupThemeWidget = function(){
	this.controller.setupWidget(
		"theme",
		{
			labelPlacement: Mojo.Widget.labelPlacementLeft,
			modelProperty: "theme",
			disabledProperty: "theme_disabled",
			label: $L("Theme"),
			choices:
				[
					{label: "webTea", value: "tea"},
					{label: "webToast", value: "toast"},
					{label: "webEgg", value: "egg"}
				]
		},
		webTea.Data
		);
	Mojo.Event.listen(
		this.controller.get("theme"),
		Mojo.Event.propertyChange,
		this.handleTheme.bind(this)
	);
} // -----------------------------------------------------------------


PreferencesAssistant.prototype.setupToneWidget = function(){
	var filename = new String(webTea.Data.tone.substr(webTea.Data.tone.lastIndexOf("/")+1));
	$('tone').innerHTML = filename.substr(0,filename.indexOf("."));
	$('tonerow').observe(Mojo.Event.tap, this.showRingtonePicker.bindAsEventListener(this));
} // -----------------------------------------------------------------


PreferencesAssistant.prototype.showRingtonePicker = function(){
	Mojo.FilePicker.pickFile(
		{"kinds": ["ringtone"], "onSelect": this.handleTone.bind(this)},
		Mojo.Controller.stageController);
}

PreferencesAssistant.prototype.handleTone = function(file){
	webTea.Data.tone = file.fullPath;
	$('tone').innerHTML = file.name;
	
}

PreferencesAssistant.prototype.handleAutostart = function(event){
	webTea.Data.autostart = event.value;
}

PreferencesAssistant.prototype.handleBlockscreentimeout = function(event){
	webTea.Data.blockscreentimeout = event.value;
}

PreferencesAssistant.prototype.handleTheme = function(event){
	webTea.Data.theme = event.value;
	// @todo Dodělat ještě nějak tu změnu pozadí on-access
}

PreferencesAssistant.prototype.deactivate = function(event) {
  webTea.Data.storeCookie();
  	//document.getElementsByClassName("palm-default")[0].style.backgroundPositionX = this.std_background;
	Mojo.Log.info(this.std_background);

}

PreferencesAssistant.prototype.cleanup = function(event) {
	  
	Mojo.Event.stopListening(this.controller.get("autostart"), Mojo.Event.propertyChange, this.handleAutostart.bind(this));
	Mojo.Event.stopListening(this.controller.get("theme"), Mojo.Event.propertyChange, this.handleTheme.bind(this));
	Mojo.Event.stopListening(this.controller.get("tonerow"), Mojo.Event.tap, this.showRingtonePicker.bind(this));

}
