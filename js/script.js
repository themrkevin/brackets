/*
	Author: Kevin Mangubat
*/

var playerList = []
var mainBrack = []
var losersBrack = []
var TourConfig = {}
var Brack = {

	/**
	 * throwing the global toys in here to avoid any conflict
	 * from future potential plugins && I just find it easier to read
	 **/
	globalSelectors : function() {

		//Forms
		this.theForm = $('form');
		this.playerForm = $('#player-form');
		this.configForm = $('#config-form');
		this.theField = Brack.theForm.find('input[type="text"]');
		this.nameField = Brack.playerForm.find('input[name="name"]');
		this.titleField = Brack.configForm.find('input[name="name"]');
		this.typeField = Brack.configForm.find('select[name="type"]');
		this.roundsField = Brack.configForm.find('input[name="rounds"]');
		this.configSubmit = Brack.configForm.find('.submit');
		
		//Panels
		this.controlPanel = $('#control-panel');
		this.optionPanels = $('#option-panels');
		this.resetAll = $('#new-tournament');

		//Elements
		this.main = $('#main');
		this.brackets = $('#brackets');
		this.playerList = $('#player-list');
		this.roundTemp = Brack.brackets.find('.round-template');
		this.matchTemp = Brack.brackets.find('.match-template');

	},

// Local Storaging ----------------------------------------------------------------

	/**
	 * Store players into localStorage and spit it back out as an array
	 **/
	loadPList : function() {
		Brack.sPlayerList = localStorage.getItem('playerList');
		Brack.pPlayerList = JSON.parse(Brack.sPlayerList);
		//console.log('pPlayerList loaded: ', Brack.pPlayerList);
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
	 * Store Config settings into local storage and return as an object
	 **/
	loadOpeningRound : function() {
		Brack.sR_PlayerList = localStorage.getItem('r_playerList');
		Brack.openingRound = JSON.parse(Brack.sR_PlayerList);
		console.log('openingRound loaded: ', Brack.openingRound);
	},

// --------------------------------------------------------------- Local Storaging 
// Templates Compilation ---------------------------------------------------------

	/**
	 * Find && Replace player list template data
	 **/
	pListTemplate : function(item,source) {

		item.find('.list-item-name').text(source.name);
		return item;
	},

	/**
	 * Find && Replace match-up template data
	 **/
	matchTemplate : function(item,source) {

		console.log('The source is: ', source);
		item.find('.player-name').text(source.name);
		return item;

	},

	/**
	 * Find && Replace round template data
	 **/
	roundTemplate : function(item,source) {

		console.log('The source is: ', source);
		item.find('.this-round').text(source.name);
		return item;

	},

// --------------------------------------------------------- Templates Compilation

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
		Brack.assignConfig();
		Brack.updateThatJunk();
		Brack.configTypeCheck(Brack.typeField,Brack.roundsField);

	},

	/**
	 * Display players to list && Clones the template
	 **/
	addToList : function(thisPlayer) {
		
		Brack.listTemplate = Brack.playerList.find('.template');

		var $newItem = Brack.listTemplate.clone().removeClass('template');
		Brack.pListTemplate($newItem,thisPlayer).appendTo((Brack.playerList));

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

	/**
	 * Check for Player position in array
	 **/
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

		if(Brack.pPlayerList !== null) {
			Brack.playerCount = Brack.playerList.find('.count');
			Brack.playerCount.text(Brack.pPlayerList.length);
		}

	},

	/**
	 * Contains all the panel controls (Main Navigation)
	 **/
	panelControls : function() {

		Brack.settingsContainer = Brack.main.find('.settings-toggle');
		Brack.settingsToggle = Brack.settingsContainer.find('a');
		Brack.settingsClose = Brack.settingsContainer.find('.settings-close')
		Brack.playerListContainer = Brack.optionPanels.find('.player-list-container');

		Brack.settingsToggle.click(function() {
			if(Brack.optionPanels.hasClass('option-close')) {
				Brack.optionPanels
					.removeClass('option-close')
					.addClass('option-open');
				Brack.settingsClose.text('<<');
			} else {
				Brack.optionPanels
					.addClass('option-close')
					.removeClass('option-open');
				Brack.settingsClose.text('>>');
			}
			return false;
		});

	},

	/**
	 * Build brackets & clones template for matches
	 **/
	buildBrackets : function() {

		var numOfPlayers = Brack.pPlayerList.length;
		var numOfMatches = numOfPlayers/2;
		var match;
		var i;

		for(i = 0; i < numOfMatches; i++) {
			match = Brack.matchTemp
						.clone()
						.removeClass('match-template template')
						.addClass('match-' + i)
						.appendTo(Brack.matchTemp.parent());
			console.log(match);
		}

		/*
		Brack.listTemplate = Brack.playerList.find('.template');

		var $newItem = Brack.listTemplate.clone().removeClass('template');
		Brack.pListTemplate($newItem,thisPlayer).appendTo((Brack.playerList));
		*/
		
	},

	/**
	 * randomizeList() reference
	 * brought to you by http://css-tricks.com/snippets/javascript/shuffle-array/
	 *
	 *	function Shuffle(o) {
	 *		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	 *		return o;
	 *	};
	 *
	 **/

	/**
	 * Generates a random version of inputted list
	 **/
	randomizeList : function(list) {

		for(var j, x, i = list.length; i; j = parseInt(Math.random() * i), x = list[--i], list[i] = list[j], list[j] = x);
		return list;

	},

	/**
	 *	Distributes players into the first round of matches
	 **/
	seatPlayers : function() {

		var r_pPlayerList = Brack.pPlayerList;

		//store r_playerList locally && reload it as a local object
		localStorage.setItem('r_playerList', JSON.stringify(r_playerList));
		Brack.loadOpeningRound();

		for(i = 0; i < r_pPlayerList.length; i++) {
			console.log(r_pPlayerList[i].name);
		}

	},

	/**
	 * Assigns all congifuration settings to both the forms and bracket tables
	 **/
	assignConfig : function() {

		Brack.loadTourConfig();
		Brack.bracketHeads = $('#tournament-heads');
		if(Brack.pTourConfig === null) {
			console.log('assignConfig(): No configuration saved');

			//update bracket info
			Brack.bracketHeads.find('h1').text('Event Name');
			Brack.bracketHeads.find('h2').html('Event Type: <i>0<i> Rounds');

			//update config forms
			Brack.configForm.find('.input-rounds').text('Enter # of Rounds');
			Brack.titleField.val('Enter Event Name');
			Brack.typeField.val('Swiss');
			Brack.roundsField.val('Enter # of Rounds');
		} else {
			console.log('assignConfig(): New config set');

			//update bracket info
			Brack.bracketHeads.find('h1').text(Brack.pTourConfig.title);
			Brack.bracketHeads.find('h2').html(Brack.pTourConfig.type + ': <i>' + Brack.pTourConfig.rounds + '<i> Rounds');

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

		console.log('filterConfig(): ');
		if(Brack.pPlayerList == null || Brack.pPlayerList.length == 0 && Brack.pTourConfig == null) {
			//filter 
			console.log(' - playerList is null');
			console.log(' - pTourConfig is null');

			Brack.roundsField.addClass('hidden');
			Brack.configForm.find('.config-rounds').addClass('hidden');

		} else if ((Brack.pPlayerList !== null || Brack.pPlayerList.length > 0) && Brack.pTourConfig == null) {
			//filter state
			console.log(' - playerList is available');
			console.log(' - pTourConfig is null');

			Brack.roundsField.removeClass('hidden');
			Brack.configForm.find('.config-rounds').removeClass('hidden');

		} else if ((Brack.pPlayerList == null || Brack.pPlayerList.length == 0) && Brack.pTourConfig !== null) {
			//filter state
			console.log(' - playerList is null');
			console.log(' - pTourConfig is available');

		} else {
			//filter state
			console.log(' - playerList is available');
			console.log(' - pTourConfig is available');

		}

		console.log('filterConfig(): Configuration filtered');
		console.timeEnd('Filter Configuration');

	},

	/**
	 * Checks for the type of tournament and computes # of rounds if applicable
	 * Contains all the complicated algorithmns
	 **/
	configTypeCheck : function(typeField,roundsField) {

	
		Brack.inputRounds = Brack.configForm.find('.input-rounds');

		if(Brack.pPlayerList !== null && Brack.pPlayerList.length > 0) {
			console.log('configTypeCheck(): player list detected ', (Brack.pPlayerList));
			//Checks Event Type
			var players = Brack.pPlayerList.length;
			var totalRounds;
			var showTypeInput = function() {
				Brack.configForm.find('.config-rounds').removeClass('hidden');
				Brack.inputRounds.removeClass('hidden');
				roundsField.addClass('hidden');
			}

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
				showTypeInput();

			} else if(typeField.val() === 'Double Elimination') {

				totalRounds = (2*players-1);
				if(totalRounds == '-1') {
					totalRounds = 0;
				}
				Brack.inputRounds.text(totalRounds);
				showTypeInput();

			} else if(typeField.val() === 'Round Robin') {

				totalRounds = (players/2*(players-1));
				Brack.inputRounds.text(totalRounds);
				showTypeInput();
			
			} else {
			
				// else use Swiss - # of Rounds will be input manually (Default = 3)
				if(Brack.pTourConfig !== null && Brack.pTourConfig.rounds) {
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
			console.log('configTypeCheck(): player list does not exist ', (Brack.pPlayerList));
			if(typeField.val() !== 'Swiss') {
				Brack.configForm.find('.config-rounds').addClass('hidden');
				roundsField.addClass('hidden');
			} 

			Brack.typeField.change(function() {
				if(typeField.val() === 'Swiss') {
					Brack.configForm.find('.config-rounds').removeClass('hidden');
					roundsField.removeClass('hidden');
					Brack.inputRounds.addClass('hidden');
				} else {
					Brack.configForm.find('.config-rounds').addClass('hidden');
					roundsField.addClass('hidden');
					Brack.inputRounds.removeClass('hidden');
				}
			});
		}

		console.log('configTypeCheck(): Configuration checked');

		

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
			if(Brack.roundsField.val().match(numericExpression) || Brack.roundsField.val() === 'Enter # of Rounds' || Brack.roundsField.val() === '-Infinity' || Brack.roundsField.val() === '-1') {
				//inject field data into object
				TourConfig.title = Brack.titleField.val();
				TourConfig.type = Brack.typeField.val();
				if(Brack.roundsField.val() === 'Enter # of Rounds') {
					TourConfig.rounds = 3;
				} else if(Brack.roundsField.val() === '-Infinity' || Brack.roundsField.val() === '-1') {
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
				Brack.optionPanels
					.removeClass('options-open')
					.addClass('option-close');

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
			Brack.updateThatJunk();
		});

		$cancelReset.click(function() {
			Brack.optionPanels.find('.reset-all-container').hide();
		});

	},

	/**
	 * Makes sure that the most recent data is being displayed
	 **/
	updateThatJunk : function() {
		
		Brack.playerCounter();
		Brack.configTypeCheck(Brack.typeField,Brack.roundsField);
		Brack.filterConfig();

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
		}
		Brack.updateThatJunk();
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