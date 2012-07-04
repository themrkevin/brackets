/*
	Author: Kevin Mangubat
*/

var playerList = []
var TourConfig = {}
var Brack = {

	globalSelectors : function() {

		//throwing the global toys in here to avoid any conflict
		//from future potential plugins && I just find it easier to read

		this.theForm = $('form');
		this.playerList = $('#player-list');
		this.playerForm = $('#player-form');
		this.configForm = $('#config-form');
		this.brackets = $('#brackets');
		this.controlPanel = $('#control-panel');
		this.theField = Brack.theForm.find('input[type="text"]');
		this.nameField = Brack.playerForm.find('input[name="name"]');
		this.titleField = Brack.configForm.find('input[name="name"]');
		this.typeField = Brack.configForm.find('select[name="type"]');
		this.roundsField = Brack.configForm.find('input[name="rounds"]');
		this.configSubmit = Brack.configForm.find('.submit');

	},

	//create players
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
		Brack.playerCounter();
		Brack.toggleClear();
		Brack.configTypeCheck(Brack.typeField,Brack.roundsField);

	},

	loadPList : function() {
		Brack.sPlayerList = localStorage.getItem('playerList');
		Brack.pPlayerList = JSON.parse(Brack.sPlayerList); 
	},

	template : function(item,source) {

		//find && replace template data
		item.find('.list-item-name').text(source.name);
		return item;
	},

	addToList : function(thisPlayer) {
		
		Brack.listTemplate = Brack.playerList.find('.template');

		//display players to list && clone template
		var $newItem = Brack.listTemplate.clone().removeClass('template');
		Brack.template($newItem,thisPlayer).appendTo((Brack.playerList));
	},

	toggleOptions : function() {

		Brack.optionsButton = Brack.playerList.find('.add');
		//opens the form to add players
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

		Brack.conOptButton = Brack.configForm.find('.add');
		Brack.currentSet = Brack.configForm.find('.set');

		if((Brack.pTourConfig) == null) {
			console.log('no configuration saved');

			Brack.conOptButton.addClass('hidden');
			Brack.currentSet.addClass('hidden');
			Brack.configSubmit.removeClass('hidden');
			Brack.titleField.removeClass('hidden');
			Brack.typeField.removeClass('hidden');
			Brack.roundsField.removeClass('hidden');

		} else {
			Brack.conOptButton.click(function() {
				if(Brack.configSubmit.is(':visible')) {
					$(this).removeClass('neg');
					$(this).addClass('pos');
					Brack.configSubmit.addClass('hidden');
					Brack.titleField.addClass('hidden');
					Brack.typeField.addClass('hidden');
					Brack.roundsField.addClass('hidden');
					Brack.assignConfig();
				} else {
					$(this).removeClass('pos');
					$(this).addClass('neg');
					Brack.configSubmit.removeClass('hidden');
					Brack.titleField.removeClass('hidden');
					Brack.typeField.removeClass('hidden');
					Brack.roundsField.removeClass('hidden');
				}

				return false;
			});
		}


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
			Brack.playerCounter();
			Brack.configTypeCheck(Brack.typeField,Brack.roundsField);

			return false;
		});
		
	},

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
			Brack.configTypeCheck(Brack.typeField,Brack.roundsField);

			return false;
		});

		Brack.clearConfirm.find('.cancel').click(function() {
			Brack.clearConfirm.addClass('hidden');
			Brack.clearAll.removeClass('hidden');

			return false;
		});

	},

	clearAllInit : function() {

		//target all the players (li) except for template (li)
		var $liList = Brack.playerList.find('li:not(".template")');

		$liList.fadeOut('slow', function(){
			$liList.remove();
		});
		
		//find the player names
		var $liPlayerNames = $liList.find('.list-item-name').text();
		Brack.valueOfKey($liPlayerNames);

		//remove all players from list && refresh localStorage
		playerList.length = 0;
		localStorage.setItem('playerList', JSON.stringify(playerList));
		Brack.loadPList();
		Brack.playerCounter();

		return false;

	},

	toggleClear : function() {

		//this will check to see if there are any players in the field, if not then the clear button will not display
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

	playerCounter : function() {

		Brack.playerCount = Brack.playerList.find('.count');
		Brack.playerCount.text(Brack.pPlayerList.length);

	},

	thePlayerList : function() {

		Brack.optionPanels = $('#option-panels');

		Brack.playerListContainer = Brack.optionPanels.find('.player-list-container');
		Brack.listToggle = Brack.controlPanel.find('.list-toggle');

		Brack.listToggle.click(function() {
			Brack.playerListContainer.toggle();

			return false;
		});

		Brack.configContainer = Brack.optionPanels.find('.config-container');
		Brack.configToggle = Brack.controlPanel.find('.config-toggle');

		Brack.configToggle.click(function() {
			Brack.configContainer.toggle();

			return false;
		});

	},

	buildBrackets : function() {

	},

	assignConfig : function() {

		Brack.loadTourConfig();
		if((Brack.pTourConfig) == null) {
			console.log('no configuration saved');
		} else {
			Brack.brackets.find('h1').text(Brack.pTourConfig.title);
			Brack.brackets.find('h2').html(Brack.pTourConfig.type + ': <i>' + Brack.pTourConfig.rounds + '<i> Rounds');
			Brack.configForm.find('.input-title').text(Brack.pTourConfig.title);
			Brack.configForm.find('.input-type').text(Brack.pTourConfig.type);
			Brack.configForm.find('.input-rounds').text(Brack.pTourConfig.rounds);
		}

	},

	configTypeCheck : function(typeField,roundsField) {

		Brack.inputRounds = Brack.configForm.find('.input-rounds');

		if(Brack.pPlayerList !== undefined) {
			//Checks Event Type
			var players = Brack.pPlayerList.length;
			var totalRounds;

			if(typeField.val() === 'Single Elimination') {
				var formula = Math.log(players)/Math.LN2;

				if(formula % 1 !== 0) {
					totalRounds = (Math.floor(formula) + 1);
				} else {
					totalRounds = (formula);
				}

				Brack.inputRounds.text(totalRounds);
				roundsField.addClass('hidden');
			} else if(typeField.val() === 'Double Elimination') {
				totalRounds = (2*players-1);
				Brack.inputRounds.text(totalRounds);
				roundsField.addClass('hidden');
			} else if(typeField.val() === 'Round Robin') {
				totalRounds = (players/2*(players-1));
				Brack.inputRounds.text(totalRounds);
				roundsField.addClass('hidden');
			} else {
				totalRounds = 'Enter # of Rounds';
				Brack.inputRounds.text(3);
				roundsField.removeClass('hidden');
			}

			roundsField.val(totalRounds);
		}

	},

	loadTourConfig : function() {
		Brack.sTourConfig = localStorage.getItem('TourConfig');
		Brack.pTourConfig = JSON.parse(Brack.sTourConfig);
		console.log('pTourConfig loaded: ', Brack.pTourConfig);
	},

	formTricks : function() {
		
		Brack.fieldInput;
		
		//field focus replace
		Brack.theField.focus(function() {
			if(this.value == this.defaultValue) {
				this.value = '';
			}
			if(this.value != this.defaultValue){  
	            this.select();
	        } 
		});

		Brack.theField.blur(function() {
			if($.trim(this.value) == '') {
				this.value = (this.defaultValue ? this.defaultValue : '');
			}
		});

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

		Brack.configForm.submit(function() {
			var numericExpression = /^[0-9]+$/;
			if(Brack.roundsField.val().match(numericExpression)) {
				//inject field data into object
				TourConfig.title = Brack.titleField.val();
				TourConfig.type = Brack.typeField.val();
				TourConfig.rounds = Brack.roundsField.val();

				//store playerList locally && reload it as a local object
				localStorage.setItem('TourConfig', JSON.stringify(TourConfig));
				Brack.assignConfig();

				console.log('Config Updated: ', TourConfig);
				console.log('Title: ', TourConfig.title);
				console.log('Type: ', TourConfig.type);
				console.log('Rounds: ', TourConfig.rounds);
			} else {
				console.log('this is not a number');
			}

			return false;
		});

	},

	repopulate : function() {

		Brack.loadPList();
		//goes through localStorage and repopulates data
		for ( i = 0; i < Brack.pPlayerList.length; i++ ) {
			playerList[playerList.length] = Brack.pPlayerList[i];
			Brack.addToList(Brack.pPlayerList[i]);
		}
		Brack.playerCounter();
		Brack.assignConfig();

	},

	makeItHappen : function() {

		if(localStorage.playerList !== undefined) {
			Brack.repopulate();
		} else {
			console.log('there are no players');
		}

		Brack.toggleOptions();
		Brack.removePlayer();
		Brack.formTricks();
		Brack.thePlayerList();
		Brack.clearAllPlayer();

	}
}

//player constructor
function Player(name) {
	this.name = name;
}

$(document).ready(function() {

	Brack.globalSelectors();
	Brack.makeItHappen();

});