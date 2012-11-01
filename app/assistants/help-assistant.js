function HelpAssistant() {
}

HelpAssistant.prototype.setup = function() {
	this.std_background = document.getElementsByClassName("palm-default")[0].style.backgroundPositionX;
	document.getElementsByClassName("palm-default")[0].style.backgroundPositionX = "500px";
	/*Mojo.Animation.animateStyle(
		document.getElementsByClassName("palm-default")[0],
		'background-position-x',
		"linear",
		{from: "0", to: "-500", duration: 1}
		);*/
}
HelpAssistant.prototype.activate = function(event) {
}
HelpAssistant.prototype.deactivate = function(event) {
	document.getElementsByClassName("palm-default")[0].style.backgroundPositionX = this.std_background;
}
HelpAssistant.prototype.cleanup = function(event) {
}
