/*
	Author: Kevin Mangubat
*/

var playerList = []
var TourConfig = {}
var Brack = {

	/**
	 * throwing the global toys in here to avoid any conflict
	 * from future potential plugins && I just find it easier to read
	 **/
	globalSelectors : function() {

		this.theForm = $('form');
		this.playerList = $('#player-list');
		this.playerForm = $('#player-form');
		this.configForm = $('#config-form');
		this.brackets = $('#brackets');
		this.controlPanel = $('#control-panel');
		this.optionPanels = $('#option-panels');
		this.resetAll = $('#new-tournament');
		this.theField = Brack.theForm.find('input[type="text"]');
		this.nameField = Brack.playerForm.find('input[name="name"]');
		this.titleField = Brack.configForm.find('input[name="name"]');
		this.typeField = Brack.configForm.find('select[name="type"]');
		this.roundsField = Brack.configForm.find('input[name="rounds"]');
		this.configSubmit = Brack.configForm.find('.submit');
		this.currentSet = Brack.configForm.find('.set');

	},

	/**
	 * Create Players
	 **/
	createPlayer : function(playerName) {
		
		//this creates the new player and assigns the name
		Brack.newPlayer = new Player(playerName);
		console.log('new player has been added: ', Brack.newPlayer);

		//inject new player into array
		playerList[playerList.length] = Brack.newPlayer;
		console.log('updated list: ', playerList);

		//store playerList locally && reload it as a local object
		localStorage.setItem('playerList', JSON.stringify(playerList));
		Brack.loadPList();

		var thisPosition = (Brack.pPlayerList.length - 1);
		var thisPlayer = Brack.pPlayerList[thisPosition];

		Brack.addToList(thisPlayer);
		Brack.toggleClear();
		Brack.updateThatJunk();

	},

	/**
	 * Store players into localStorage and spit it back out as an array
	 **/
	loadPList : function() {
		Brack.sPlayerList = localStorage.getItem('playerList');
		Brack.pPlayerList = JSON.parse(Brack.sPlayerList);
		//console.log('pPlayerList loaded: ', Brack.pPlayerList);
	},

	/**
	 * Find && Replace template data
	 **/
	template : function(item,source) {

		item.find('.list-item-name').text(source.name);
		return item;
	},

	/**
	 * Display players to list && Clones the template
	 **/
	addToList : function(thisPlayer) {
		
		Brack.listTemplate = Brack.playerList.find('.template');

		var $newItem = Brack.listTemplate.clone().removeClass('template');
		Brack.template($newItem,thisPlayer).appendTo((Brack.playerList));

	},

	removePlayer : function() {
		
		Brack.removePlayer = Brack.playerList.find('.remove');

		Brack.removePlayer.live('click', function(){

			//target the group LI container
			var $liGroup = $(this).parent().parent();

			$liGroup.fadeOut('slow', function(){
				$liGroup.remove();
				Brack.toggleClear();
			});
			
			//find the players Name of selected group
			var $liGroupName = $liGroup.find('.list-item-name').text();
			Brack.valueOfKey($liGroupName);

			console.log('Player position: ', Brack.playerPos);
			console.log('removing: ', $liGroupName);

			//remove this player from player list && refresh localStorage
			playerList.splice(Brack.playerPos,1);
			localStorage.setItem('playerList', JSON.stringify(playerList));
			Brack.loadPList();
			Brack.updateThatJunk();

			return false;
		});
		
	},

	/**
	 * Confirms clearAllInit();
	 **/
	clearAllPlayer : function() {

		Brack.clearAll = Brack.playerListContainer.find('.clear-all');
		Brack.clearConfirm = Brack.playerListContainer.find('.clear-confirm');

		Brack.clearAll.click(function() {
			$(this).addClass('hidden');
			Brack.clearConfirm.removeClass('hidden');

			return false;
		});

		Brack.clearConfirm.click(function() {
			return false;
		});

		Brack.clearConfirm.find('.clear').click(function() {
			Brack.clearAllInit();
			Brack.clearAll.addClass('hidden');
			Brack.clearConfirm.addClass('hidden');

			return false;
		});

		Brack.clearConfirm.find('.cancel').click(function() {
			Brack.clearConfirm.addClass('hidden');
			Brack.clearAll.removeClass('hidden');

			return false;
		});

	},

	/**
	 * Clears all players from localStorage && list, then updates the player count
	 **/
	clearAllInit : function() {

		//target all the players (li) except for template (li)
		var $liList = Brack.playerList.find('li:not(".template")');

		$liList.fadeOut('slow', function(){
			$liList.remove();
			Brack.updateThatJunk();
		});
		
		//find the player names
		var $liPlayerNames = $liList.find('.list-item-name').text();
		Brack.valueOfKey($liPlayerNames);

		//remove all players from list && refresh localStorage
		playerList.length = 0;
		localStorage.setItem('playerList', JSON.stringify(playerList));
		Brack.loadPList();

		return false;

	},

	/**
	 * Makes sure that the most recent data is being displayed
	 **/
	updateThatJunk : function() {
		Brack.playerCounter();
		if(Brack.pTourConfig !== null) {
			Brack.configTypeCheck(Brack.typeField,Brack.roundsField);
			Brack.filterConfig();
		}
	},

	/**
	 * Toggles the player list Add Player/Clear All form
	 **/
	toggleOptions : function() {

		Brack.optionsButton = Brack.playerList.find('.add');

		Brack.optionsButton.click(function() {
			if(Brack.playerForm.is(':visible')) {
				$(this).removeClass('neg');
				$(this).addClass('pos');
				Brack.playerForm.hide();
				Brack.playerList.find('.remove').addClass('switch');
				Brack.clearAll.addClass('hidden');
			} else {
				$(this).removeClass('pos');
				$(this).addClass('neg');
				Brack.playerForm.show();
				Brack.playerList.find('.remove').removeClass('switch');
				Brack.toggleClear();
			}

			return false;
		});

	},

	/**
	 * Checks to see if there are players in the field, if not, then the clear button will not display
	 **/
	toggleClear : function() {

		if(Brack.playerList.find('li:not(".template")').is(':visible')) {
			Brack.clearAll.removeClass('hidden');
		} else {
			Brack.clearAll.addClass('hidden');
		}

	},

	valueOfKey : function(value) {

		for(var pos in Brack.pPlayerList) {
			if(Brack.pPlayerList[pos].name === value) {
				console.log('found a match to: ', value);

				Brack.playerPos = pos;
			}
		}

	},

	/**
	 * Displays player count
	 **/
	playerCounter : function() {

		Brack.playerCount = Brack.playerList.find('.count');
		Brack.playerCount.text(Brack.pPlayerList.length);

	},

	/**
	 * Contains all the panel controls (Main Navigation)
	 **/
	panelControls : function() {

		//controls the players panel
		Brack.playerListContainer = Brack.optionPanels.find('.player-list-container');
		Brack.listToggle = Brack.controlPanel.find('.list-toggle');

		Brack.listToggle.click(function() {
			Brack.playerListContainer.toggle();

			return false;
		});

		//controls the configuration panel
		Brack.configContainer = Brack.optionPanels.find('.config-container');
		Brack.configToggle = Brack.controlPanel.find('.config-toggle');
		//Brack.configTypeCheck(Brack.typeField,Brack.roundsField);

		Brack.configToggle.click(function() {
			if(Brack.configContainer.is(':visible')) {
				Brack.configContainer.hide();
			} else {
				Brack.filterConfig();
				Brack.configContainer.show();
			}
			
			return false;
		});

		//controls the reset panel
		Brack.resetToggleContainer = Brack.optionPanels.find('.reset-all-container');
		Brack.resetToggle = Brack.controlPanel.find('.reset-all');

		Brack.resetToggle.click(function() {
			if(Brack.resetToggleContainer.is(':visible')) {
				Brack.resetToggleContainer.hide();
			} else {
				Brack.resetToggleContainer.show();
			}

			return false;
		});


	},



	buildBrackets : function() {

	},

	/**
	 * Assigns all congifuration settings to both the forms and bracket tables
	 **/
	assignConfig : function() {

		Brack.loadTourConfig();
		if(Brack.pTourConfig == null) {
			console.log('no configuration saved');

			//update bracket info
			Brack.brackets.find('h1').text('Event Name');
			Brack.brackets.find('h2').html('Event Type: <i>0<i> Rounds');

			//update config forms
			Brack.configForm.find('.input-rounds').text('Enter # of Rounds');
			Brack.titleField.val('Enter Event Name');
			Brack.typeField.val('Swiss');
			Brack.roundsField.val('Enter # of Rounds');
		} else {
			console.log('new config set');

			//update bracket info
			Brack.brackets.find('h1').text(Brack.pTourConfig.title);
			Brack.brackets.find('h2').html(Brack.pTourConfig.type + ': <i>' + Brack.pTourConfig.rounds + '<i> Rounds');
			//Brack.configForm.find('.input-title').text(Brack.pTourConfig.title);
			//Brack.configForm.find('.input-type').text(Brack.pTourConfig.type);

			//update config forms
			Brack.configForm.find('.input-rounds').text(Brack.pTourConfig.rounds);
			Brack.titleField.val(Brack.pTourConfig.title);
			Brack.typeField.val(Brack.pTourConfig.type);
			Brack.roundsField.val(Brack.pTourConfig.rounds);
		}

	},

	/**
	 * Checks available data in localStoarge and filters config form fields
	 **/
	filterConfig : function() {

		console.time('Filter Configuration');
		Brack.roundsSet = Brack.configForm.find('.input-rounds');

		if(Brack.pPlayerList == null || Brack.pPlayerList.length == 0 && Brack.pTourConfig == null) {
			//filter state
			console.log('playerList is null');
			console.log('pTourConfig is null');

			Brack.roundsField.addClass('hidden');

			Brack.configForm.find('.config-rounds').addClass('hidden');

		} else if ((Brack.pPlayerList !== null || Brack.pPlayerList.length > 0) && Brack.pTourConfig == null) {
			//filter state
			console.log('playerList is available');
			console.log('pTourConfig is null');

			Brack.roundsField.removeClass('hidden');

		} else if ((Brack.pPlayerList == null || Brack.pPlayerList.length == 0) && Brack.pTourConfig !== null) {
			//filter state
			console.log('playerList is null');
			console.log('pTourConfig is available');

		} else {
			//filter state
			console.log('playerList is available');
			console.log('pTourConfig is available');

		}

		console.timeEnd('Filter Configuration');

	},

	/**
	 * Checks for the type of tournament and computes # of rounds if applicable
	 **/
	configTypeCheck : function(typeField,roundsField) {

		Brack.inputRounds = Brack.configForm.find('.input-rounds');

		if(Brack.pPlayerList !== undefined) {
			//Checks Event Type
			var players = Brack.pPlayerList.length;
			var totalRounds;

			Brack.configForm.find('.config-rounds').removeClass('hidden');
			roundsField.removeClass('hidden');

			if(typeField.val() === 'Single Elimination') {
				var formula = Math.log(players)/Math.LN2;

				if(formula % 1 !== 0) {
					totalRounds = (Math.floor(formula) + 1);
					if(totalRounds == '-Infinity') {
						totalRounds = 0;
					}
				} else {
					totalRounds = (formula);
					if(totalRounds == '-Infinity') {
						totalRounds = 0;
					}
				}

				Brack.inputRounds.text(totalRounds);
				Brack.inputRounds.removeClass('hidden');
				roundsField.addClass('hidden');
			} else if(typeField.val() === 'Double Elimination') {
				totalRounds = (2*players-1);
				if(totalRounds == '-1') {
					totalRounds = 0;
				}
				Brack.inputRounds.text(totalRounds);
				Brack.inputRounds.removeClass('hidden');
				roundsField.addClass('hidden');
			} else if(typeField.val() === 'Round Robin') {
				totalRounds = (players/2*(players-1));
				Brack.inputRounds.text(totalRounds);
				roundsField.addClass('hidden');
				Brack.inputRounds.removeClass('hidden');
			} else {
				// else use Swiss - # of Rounds will be input manually (Defaul = 3)
				if(Brack.pTourConfig.rounds) {
					totalRounds = Brack.pTourConfig.rounds;
				} else {
					totalRounds = 'Enter # of Rounds';
				}
				Brack.inputRounds.text(3);
				roundsField.removeClass('hidden');
				Brack.inputRounds.addClass('hidden');
			}

			roundsField.val(totalRounds);
		} else {
			if(typeField.val() !== 'Swiss') {
				Brack.configForm.find('.config-rounds').addClass('hidden');
				roundsField.addClass('hidden');

			}
			Brack.typeField.change(function() {
				if(typeField.val() === 'Swiss') {
					Brack.configForm.find('.config-rounds').removeClass('hidden');
					roundsField.removeClass('hidden');
				} else {
					Brack.configForm.find('.config-rounds').addClass('hidden');
					roundsField.addClass('hidden');
				}
			});
		}

	},

	/**
	 * Store Config settings into local storage and return as an object
	 **/
	loadTourConfig : function() {
		Brack.sTourConfig = localStorage.getItem('TourConfig');
		Brack.pTourConfig = JSON.parse(Brack.sTourConfig);
		//console.log('pTourConfig loaded: ', Brack.pTourConfig);
	},

	/**
	 * General form functions
	 **/
	formTricks : function() {
		
		Brack.fieldInput;
		
		//field focus replace
		Brack.theField.focus(function() {
			if(this.value == this.defaultValue) {
				this.value = '';
			}
			if(this.value != this.defaultValue) {  
	            this.select();
	        } 
		});

		Brack.theField.blur(function() {
			if($.trim(this.value) == '') {
				this.value = (this.defaultValue ? this.defaultValue : '');
			}
		});

		// player form submit functions
		Brack.playerForm.submit(function() {
			//take the input value of the name field and shove it into the player maker
			Brack.fieldInput = Brack.nameField.val();
			Brack.createPlayer(Brack.fieldInput);

			//restore name field to default
			Brack.nameField.val('');

			return false;
		});

		Brack.typeField.change(function() {
			Brack.configTypeCheck(Brack.typeField,Brack.roundsField);
		});


		// configuration submit functions
		Brack.configForm.submit(function() {
			var numericExpression = /^[0-9]+$/;
			if(Brack.roundsField.val().match(numericExpression) || Brack.roundsField.val() === 'Enter # of Rounds' || Brack.roundsField.val() == '-Infinity' || Brack.roundsField.val() == '-1') {
				//inject field data into object
				TourConfig.title = Brack.titleField.val();
				TourConfig.type = Brack.typeField.val();
				if(Brack.roundsField.val() == 'Enter # of Rounds') {
					TourConfig.rounds = 3;
				} else if(Brack.roundsField.val() == '-Infinity' || Brack.roundsField.val() == '-1') {
					TourConfig.rounds = 0;
				} else {
					TourConfig.rounds = Brack.roundsField.val();
				}

				//store playerList locally && reload it as a local object
				localStorage.setItem('TourConfig', JSON.stringify(TourConfig));
				Brack.assignConfig();

				console.log('Config Updated: ', TourConfig);
				console.log('Title: ', TourConfig.title);
				console.log('Type: ', TourConfig.type);
				console.log('Rounds: ', TourConfig.rounds);

			} else {
				Brack.roundsField.select();
				Brack.configForm.find('.input-rounds').text('This is not a number =(');
				console.log('this is not a number');
			}

			return false;
		});

	},

	/**
	 *	Resets all settings - clears localStorage
	 **/
	startNewTourn : function() {

		var $resetAll = Brack.resetAll.find('.do-it');
		var $cancelReset = Brack.resetAll.find('.cancel');

		$resetAll.click(function() {
			Brack.clearAllInit();
			localStorage.clear();
			Brack.assignConfig();
		});

		$cancelReset.click(function() {
			Brack.optionPanels.find('.reset-all-container').hide();
		});

	},

	/**
	 * Handles reloading all locally stored elements on refresh
	 **/
	repopulate : function() {

		console.time('Repopulation');
		Brack.loadPList();
		Brack.assignConfig();
		if(Brack.pPlayerList !== null) {
			//goes through localStorage and repopulates data
			for ( i = 0; i < Brack.pPlayerList.length; i++ ) {
				playerList[playerList.length] = Brack.pPlayerList[i];
				Brack.addToList(Brack.pPlayerList[i]);
			}
			Brack.playerCounter();
		}
		console.timeEnd('Repopulation');

	},

	/**
	 * Makes things happen :)
	 **/
	makeItHappen : function() {
		
		Brack.repopulate();
		Brack.toggleOptions();
		Brack.removePlayer();
		Brack.formTricks();
		Brack.panelControls();
		Brack.startNewTourn();
		Brack.clearAllPlayer();

	}
}

/**
 * Player Constructor
 **/
function Player(name) {
	this.name = name;
}

/**
 * On dom ready
 **/
$(document).ready(function() {
console.time('Run It');
	Brack.globalSelectors();
	Brack.makeItHappen();
console.timeEnd('Run It');
});