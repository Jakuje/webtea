function PopupAssistant( message ) {
	this.message = message;
}

PopupAssistant.prototype.setup = function() {
	this.update(this.message);
	
	this.closeButton = this.controller.get("okButton");
	this.closeHandler = this.handleClose.bindAsEventListener(this);
	Mojo.Event.listen(this.closeButton, Mojo.Event.tap, this.closeHandler);
}

PopupAssistant.prototype.update = function(message) {
	this.info = {eventSubtitle: message, subject: "webTea"};
	Mojo.Log.info("Popup Update");
	// Use render to convert the object and its properties
	// along with a view file into a string containing HTML
	var renderedInfo = Mojo.View.render({
		object: this.info,
		template: 'popup/item-info'
	});
	var infoElement = this.controller.get('info');
	infoElement.innerHTML = renderedInfo;
};

PopupAssistant.prototype.handleClose = function(){
	this.controller.window.close();
};

PopupAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.closeButton, Mojo.Event.tap, this.closeHandler);
}
