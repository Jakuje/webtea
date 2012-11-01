const CMD_HELP = 'do-help';
const CMD_PREF = 'do-pref';
const CMD_ABOUT = 'do-about';

const MAIN_STAGE = "mainStage" 


function AppAssistant (appController){
}

AppAssistant.prototype.setup = function(){
	
}

AppAssistant.prototype.handleLaunch = function( launchParams ){

	Mojo.Log.info("ReLaunch");
	
	var cardStageController = this.controller.getStageController(MAIN_STAGE);
	var appController = Mojo.Controller.getAppController();
    
	var pushMainScene = function(stageController){
		stageController.pushScene('main');
	}
	
	var pushPopup = function(stageController) {
	    stageController.pushScene('popup', $L("Your Tea is ready to serve!"));
	}
	
	if( !launchParams ){
		// FIRST LAUNCH
		if(cardStageController){
			Mojo.Log.info("Focus window");
			cardStageController.popScenesTo('main');
			cardStageController.activate();
		} else {
			Mojo.Log.info("Create main stage");
			this.controller.createStageWithCallback({name:MAIN_STAGE}, pushMainScene.bind(this), "card");
		}
	} else {
		Mojo.Log.info("Wakeup Call ", launchParams.action);
		switch (launchParams.action){
			case "popup":
				if( cardStageController ){
					Mojo.Log.info("Popup focus");
					/*cardStageController.popScenesTo('main');
					cardStageController.pushScene("popup");*/
					this.controller.createStageWithCallback({name: "popupStage", lightweight: true, height: 130,
						sound: launchParams.sound},
						pushPopup, 'popupalert');
					//cardStageController.activate();
				} else {
					Mojo.Log.info("Notification create new scene");
					// @WFT
					//this.controller.createStageWithCallback({name:MAIN_STAGE}, pushMainScene.bind(this), "card");
					this.controller.createStageWithCallback({name: "popupStage", lightweight: true, height: 130,
						sound: launchParams.sound},
						pushPopup, 'popupalert');
				}
				break;
		}
	};
}

AppAssistant.prototype.handleCommand = function(event){
	var stageController = this.controller.getStageController(MAIN_STAGE);
	var currentScene = stageController.activeScene();
	if(event.type == Mojo.Event.command && stageController) {
		switch(event.command)
		{
			case CMD_PREF:
				stageController.pushScene(
					{ name: 'preferences', transition: Mojo.Transition.crossFade});
				break;
			case CMD_HELP:
				stageController.pushScene(
					{ name: 'help', transition: Mojo.Transition.crossFade});
				break;
			case CMD_ABOUT:
				currentScene.showAlertDialog({
  					onChoose: function(value) {},
					  title: "webTea - v1.1.5",
					  message: "Copyright 2009-2011, <a href=\"http://jakuje.dta3.com\"Jakuje</a>",
					  choices:[
					  {label:"OK", value:""}
					  ]
  				});
				break;
		}
	}
}

