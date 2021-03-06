const CMD_START = 'do-start';
const CMD_RESET = 'do-reset';

const BUTTON_LARGER = 170;
const BUTTON_SMALLER = 90;

const S1 = BUTTON_SMALLER + BUTTON_LARGER;
const S2 = 210;
const S3 = 160;

function MainAssistant() {
}

MainAssistant.prototype.activate = function(event) {
	if( ! this.updater){
		this.controller.get("progress").hide();
		//this.controller.get("teaReset").hide();
		if( webTea.Data.autostart === true){
			//Mojo.Log.info("Autostart");
			this.StartButtonTap();
		}
	} 
	document.getElementsByClassName("palm-default")[0].style.backgroundPositionX = 0;

	this.handleWindowResize();
	Mojo.Event.listen(this.controller.window, 'resize', this.handleWindowResize.bind(this));
	
}


MainAssistant.prototype.setup = function() {
	/* Setting default data from cookie */
	webTea.Data.initialize();
	
	/* Menu aplikace */
	this.appMenuModel = {
		visible: true,
		items: [
			Mojo.Menu.editItem,
			{ label: $L("About"), command: CMD_ABOUT },
			{ label: $L("Preferences"), command: CMD_PREF },
  		{ label: $L("Help"), command: CMD_HELP }
		]
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	/* Tea and time */
	this.setTeaHandler = this.setTea.bindAsEventListener(this);
	this.setTimeHandler = this.setTime.bindAsEventListener(this);
	
	Mojo.Event.listen(this.controller.get("teaTypes"), Mojo.Event.propertyChange, this.setTimeHandler)
	Mojo.Event.listen(this.controller.get("teaTime"), Mojo.Event.propertyChange, this.setTeaHandler);
	
	/*this.StartButtonTapHandler = this.StartButtonTap.bindAsEventListener(this);
	this.ResetButtonTapHandler = this.ResetButtonTap.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get("teaStart"), Mojo.Event.tap, this.StartButtonTapHandler);
	Mojo.Event.listen(this.controller.get("teaReset"), Mojo.Event.tap, this.ResetButtonTapHandler);*/
	
	this.controller.setupWidget("teaTime",
		this.timeAtributes = {
			label: $L("Time"),
			labelPlacement: Mojo.Widget.labelPlacementLeft,
			modelProperty: 'time',
			min: 1,
			max: 15
		},
		webTea.Data
	);

	this.controller.setupWidget("teaTypes",
		{
			choices: [
			        {label: $L("Other"),  value: 0, time: 0},
			        {label: $L("Green"),  value: 2, time: 2},
			        {label: $L("Sencha"), value: 1, time: 1},
			        {label: $L("White"),  value: 6, time: 6},
			        {label: $L("Black"),  value: 3, time: 3},
			        {label: $L("Oolong"), value: 4, time: 4},
			        {label: $L("Roibos"), value: 5, time: 5},
			        {label: $L("Puerh"),  value: 7, time: 7}
			],
			modelProperty: "tea",
			labelPlacement: Mojo.Widget.labelPlacementLeft,
			label: $L("Type")
		},
		webTea.Data
	);
	
	/*this.controller.setupWidget("teaStart", {}, { label: "Start!" } );
	this.controller.setupWidget("teaReset", {}, { label: "Reset!" } );*/
	
	this.controller.setupWidget(Mojo.Menu.commandMenu,
		undefined,
		this.cmdModel = {
			visible: true,
			items: [
				{width: (320 - BUTTON_LARGER - BUTTON_SMALLER)},
				{items: [
					{ label: $L("Start"), command: CMD_START, width: BUTTON_LARGER},
					{ label: $L("Reset"), command: CMD_RESET, width: BUTTON_SMALLER, disabled: true},
				 togleCmd = CMD_RESET
				]}
			]
		}
	);
	
}

MainAssistant.prototype.handleWindowResize = function(){
	
	tt = document.getElementsByClassName("tret");
	for(i = 0; i < tt.length; i++){
	  // set element height to 1/3 of window height (without 100 pixels of commands up and down)
		tt[i].style.height = (this.controller.window.innerHeight - 100)/3 + "px";
	}
	// move background to the middle of screen
	document.getElementsByClassName("palm-default")[0].style.backgroundPositionY = "-" + (540 - this.controller.window.innerHeight)/2 + "px";
	// and same with foreground ...
	this.controller.get("bg").style.backgroundPositionY = "-" + (540 - this.controller.window.innerHeight)/2 + "px";
}

MainAssistant.prototype.handleCommand = function(event){
	if(event.type == Mojo.Event.command) {
		switch(event.command)
		{
			case CMD_START:
				this.StartButtonTap();
				break;
			case CMD_RESET:
				this.ResetButtonTap();
				break;
		}
	}
}

MainAssistant.prototype.deactivate = function(event) {
	document.getElementsByClassName("palm-default")[0].style.backgroundPositionX = "500px";

	webTea.Data.storeCookie();
	
	Mojo.Event.stopListening(this.controller.window, 'resize', this.handleWindowResize.bind(this));
}

MainAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get("teaTypes"), Mojo.Event.propertyChange, this.setTimeHandler)
	Mojo.Event.stopListening(this.controller.get("teaTime"), Mojo.Event.propertyChange, this.setTeaHandler);
}




/**********************************************************************
 * 
 *              Function about timer
 */

MainAssistant.prototype.blockScreenTimeout = function(){
	var tOK = function( response){
		Mojo.Log.info("BSTimeout set ok!");
	}
	var tFail = function(response){
		Mojo.Log.info("BSTimeout error: " + response.errorText);
	}
	this.blocked = this.controller.serviceRequest("palm://com.palm.power/com/palm/power", {
		method: "activityStart",
		parameters: {
			id: "com.dta3team.webTea.activity-1",
			duration_ms: this.timerFull*1000
		},
		onSuccess: tOK.bind(this),
		onFailure: tFail.bind(this)
	});

	ctrl = Mojo.Controller.getAppController().getStageController(MAIN_STAGE);
	ctrl.setWindowProperties( { blockScreenTimeout:true } )
}

MainAssistant.prototype.unblockScreenTimeout = function(){
	var tOK = function( response){
		Mojo.Log.info("BSTimeout stopped ok!");
	}
	var tFail = function(response){
		Mojo.Log.info("BSTimeout stop error: " + response.errorText);
	}
	this.controller.serviceRequest("palm://com.palm.power/com/palm/power", {
		method: "activityEnd",
		parameters: {
			id: "com.dta3team.webTea.activity-1"
		},
		onSuccess: tOK.bind(this),
		onFailure: tFail.bind(this)
	});
	ctrl = Mojo.Controller.getAppController().getStageController(MAIN_STAGE);
	ctrl.setWindowProperties( { blockScreenTimeout:false } )
}

MainAssistant.prototype.startProgress = function(){
	this.stopped = undefined;
	
	this.timerFull = webTea.Data.time * 60;
	this.timer = this.timerFull;
	
	this.progress = 1;
	this.controller.get("bg").style.opacity = 1;

	if( webTea.Data.blockscreentimeout ){
		this.blockScreenTimeout();
	}
	
	if( !this.updater ){
		this.updateTimeBox();
		//this.timer -= 1;
		
		//var time = new String (webTea.Data.time < 10 ? '0' + webTea.Data.time : webTea.Data.time);
		
		parse = function(time){
			return (time <  10 ? '0' : '') + "" + time;
		}
		
		this.startDate = new Date();
		this.startTimestamp = this.startDate.getTime();
		
		this.stopTimestamp = this.startTimestamp + webTea.Data.time * 60 * 1000;
		this.stopDate = new Date();
		this.stopDate.setTime(this.stopTimestamp);
		this.stopDateString = new String(
			parse(this.stopDate.getUTCMonth()+1) + "/" + 
			parse(this.stopDate.getUTCDate()) + '/' +
			this.stopDate.getUTCFullYear() + ' ' + 
			parse(this.stopDate.getUTCHours()) + ':' +
			parse(this.stopDate.getUTCMinutes()) + ':' +
			parse(this.stopDate.getUTCSeconds()));
		
		Mojo.Log.info(this.stopDateString);
		var OK = function( response ){
			Mojo.Log.info("Timer started");
		}
		var Fail = function( response ){
			Mojo.Log.error("Timer error: " + response.errorText);
		}
		this.controller.serviceRequest('palm://com.palm.power/timeout', {
			method: "set",
			parameters: {
				"wakeup" : true,
				"key": "com.dta3team.webtea.timer",
				"uri": "palm://com.palm.applicationManager/launch",
				"at": this.stopDateString,
				"params": {
					id: "com.dta3team.webtea",
					params: {
						"action" : "popup",
						"sound" : webTea.Data.tone
						}
					}
				},
			
			onSuccess: OK.bind(this),
			onFailure: Fail.bind(this)
			});
		
		this.updater = this.controller.window.setInterval(this.updateProgress.bind(this), 200);
	}
}

MainAssistant.prototype.updateProgress = function(){
	if( this.stopped ){
		return;
	}
	
	var date = new Date();
	this.timer = Math.round((this.stopTimestamp - date.getTime())/1000);
	
	if( this.timer < 0 ){ //if( this.progress > 1 ){
		this.stopProgress(false);
		return;
	}
	this.updateTimeBox();
	this.progress = (this.timer / this.timerFull);
	this.controller.get("bg").style.opacity = this.progress;
	
	//this.timer -= 1;
}

MainAssistant.prototype.stopProgress = function( timer ){
	
	this.controller.get("bg").style.opacity = 0;
	
	if (this.updater) {
		this.stopped = true;
		this.controller.window.clearInterval(this.updater);
		delete this.updater;

		if( webTea.Data.blockscreentimeout ){
			this.unblockScreenTimeout();
		}
		
		var OK = function( response){
			Mojo.Log.info("Timer " + response.key + " terminated!");
		}
		var Fail = function(response){
			Mojo.Log.info("End timer error: " + response.errorText);
		}
		
		if (timer == undefined || timer == true) {
			Mojo.Log.info("Násilný konec timeoutu");
			this.controller.serviceRequest('palm://com.palm.power/timeout', {
				method: 'clear',
				parameters: {
					"key": "com.dta3team.webtea.timer"
				},
				onSuccess: OK.bind(this),
				onFailure: Fail.bind(this)
			
			});
		} else {
			//this.AddNotification();
		}
		this.ResetButtonTap();
	}		
}

MainAssistant.prototype.updateTimeBox = function(){
	min = (this.timer - (this.timer % 60))/60;
	if( min < 10 ){ min = 0 + "" + min;	}
	sec = this.timer % 60;
	if( sec < 10 ){ sec = 0 + "" + sec; }
	this.controller.get("timer").innerText = min + ":" + sec;
}

MainAssistant.prototype.restartTimer = function(){
	if (this.updater) {
		this.stopProgress(true);
		this.StartButtonTap();
	}
}


MainAssistant.prototype.AddNotification = function(){
	/*Mojo.Controller.getAppController().showBanner("Your Tea is ready to serve!",
		{ source: "notification"} );*/
	this.pushPopupScene();
	Mojo.Log.info("Tea served");
}

/*MainAssistant.prototype.pushPopupScene = function(){
	var appController = Mojo.Controller.getAppController();
	var pushPopup = function(stageController) {
	    stageController.pushScene('popup', $L("Your Tea is ready to serve!", webTea.Data.tone));
	};
	appController.createStageWithCallback({name: "popupStage", lightweight: true, height: 150}, pushPopup, 'popupalert');
}*/

/******************************************************************
 * 
 *        Functions for executing events in this view 
 */

MainAssistant.prototype.StartButtonTap = function(event){

	this.cmdModel.items[1].items[1].disabled = false;
	this.cmdModel.items[1].items[1].width = BUTTON_LARGER;
	this.cmdModel.items[1].items[0].disabled = true;
	this.cmdModel.items[1].items[0].width = BUTTON_SMALLER;
	this.controller.modelChanged(this.cmdModel);
	//Mojo.Controller.errorDialog(varDump(this.cmdModel, 3));
	
	/*this.controller.get("teaStart").hide();
	this.controller.get("teaReset").show();*/
	this.controller.get("progress").show();

	this.startProgress();
	
}

MainAssistant.prototype.ResetButtonTap = function(event){

	this.stopProgress(true);
	
	this.cmdModel.items[1].items[1].disabled = true;
	this.cmdModel.items[1].items[1].width = BUTTON_SMALLER;
	this.cmdModel.items[1].items[0].disabled = false;
	this.cmdModel.items[1].items[0].width = BUTTON_LARGER;
	this.controller.modelChanged(this.cmdModel);
	/*this.controller.get("teaStart").show();
	this.controller.get("teaReset").hide();*/
	this.controller.get("progress").hide();
	
}

MainAssistant.prototype.setTea = function(event){
	
	if ( webTea.Data.tea != webTea.Data.time ){
		webTea.Data.tea = 0;
		this.controller.setWidgetModel("teaTypes", webTea.Data);
	}
	this.restartTimer();
}

MainAssistant.prototype.setTime = function(event){

	if (webTea.Data.tea != 0 ) {
		webTea.Data.time = webTea.Data.tea;
		//this.controller.get("box").innerText = "WTF: " + this.teaTime.value;
		this.controller.setWidgetModel("teaTime", webTea.Data);
	}
	this.restartTimer();
}



/*function varDump(variable, maxDeep)
{
    var deep = 0;
    var maxDeep = maxDeep || 0;

    function fetch(object, parent)
    {
        var buffer = '';
        deep++;

        for (var i in object) {
            if (parent) {
                objectPath = parent + '.' + i;
            } else {
                objectPath = i;
            }

            if (typeof object[i] != 'function') {
				buffer += objectPath + ' (' + typeof object[i] + ')';
			}

            if (typeof object[i] == 'object') {
                buffer += "\n";
                if (deep < maxDeep) {
                    buffer += fetch(object[i], objectPath);
                }
            } else if (typeof object[i] == 'function') {
                buffer += "\n";
            } else if (typeof object[i] == 'string') {
                buffer += ': "' + object[i] + "\"\n";
            } else {
                buffer += ': ' + object[i] + "\n";
            }
        }

        deep--;
        return buffer;
    }

    if (typeof variable == 'object') {
        return fetch(variable);
    }

    return '(' + typeof variable + '): ' + variable + "\n";
}*/
