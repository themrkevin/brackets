/*
	Author: Kevin Mangubat
*/

var playerList = []
var TourConfig = {}
var $optionPanels = $('#option-panels'),
	$playerList = $('#player-list'),
	$controlPanel = $('#control-panel');
	
var Brack = {

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
		
		Brack.listTemplate = $playerList.find('.template');

		//display players to list && clone template
		var $newItem = Brack.listTemplate.clone().removeClass('template');
		Brack.template($newItem,thisPlayer).appendTo(($playerList));
	},

	toggleOptions : function() {

		Brack.optionsButton = $playerList.find('.add');
		//opens the form to add players
		Brack.optionsButton.click(function() {
			if(Brack.playerForm.is(':visible')) {
				$(this).removeClass('neg');
				$(this).addClass('pos');
				Brack.playerForm.hide();
				$playerList.find('.remove').addClass('switch');
				Brack.clearAll.addClass('hidden');
			} else {
				$(this).removeClass('pos');
				$(this).addClass('neg');
				Brack.playerForm.show();
				$playerList.find('.remove').removeClass('switch');
				Brack.toggleClear();
			}

			return false;
		});

	},

	removePlayer : function() {
		
		Brack.removePlayer = $playerList.find('.remove');

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
		var $liList = $playerList.find('li:not(".template")');

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
		if($playerList.find('li:not(".template")').is(':visible')) {
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

		Brack.playerCount = $playerList.find('.count');
		Brack.playerCount.text(Brack.pPlayerList.length);

	},

	thePlayerList : function() {

		Brack.playerListContainer = $optionPanels.find('.player-list-container');
		Brack.listToggle = $controlPanel.find('.list-toggle');

		Brack.listToggle.click(function() {
			Brack.playerListContainer.toggle();

			return false;
		});

	},

	buildBrackets : function() {

	},

	assignConfig : function() {

		Brack.brackets = $('#brackets');

		Brack.loadTourConfig();
		if((Brack.pTourConfig) == null) {
			console.log('no configuration saved');
		} else {
			Brack.brackets.find('h1').text(Brack.pTourConfig.title);
			Brack.brackets.find('h2').html(Brack.pTourConfig.type + ': <i>' + Brack.pTourConfig.rounds + '<i> Rounds');
		}

	},

	configTypeCheck : function(typeField,roundsField) {

		if(Brack.pPlayerList !== undefined) {
			//Checks Event Type
			var players = Brack.pPlayerList.length;

			if(typeField.val() === 'Limited Rounds') {

			} else if(typeField.val() === 'Single Elimination') {
				roundsField.val(Math.log(2*players))
			} else if(typeField.val() === 'Double Elimination') {

			} else if(typeField.val() === 'Round Robin') {
				roundsField.val(players/2*(players-1));
			} else {
				//do nothing
			}
		}

	},

	loadTourConfig : function() {
		Brack.sTourConfig = localStorage.getItem('TourConfig');
		Brack.pTourConfig = JSON.parse(Brack.sTourConfig);
		console.log('pTourConfig loaded: ', Brack.pTourConfig);
	},

	formTricks : function() {
		
		Brack.theForm = $('form');
		Brack.playerForm = $('#player-form'),
		Brack.configForm = $('#config-form');
		Brack.theField = Brack.theForm.find('input[type="text"]');
		Brack.nameField = Brack.playerForm.find('input[name="name"]');
		Brack.titleField = Brack.configForm.find('input[name="name"]');
		Brack.fieldInput;
		Brack.typeField = Brack.configForm.find('select[name="type"]');
		Brack.roundsField = Brack.configForm.find('input[name="rounds"]');

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

		if(localStorage.length !== 0) {
			Brack.repopulate();
		} else {
			console.log('localStorage is empty');
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

	Brack.makeItHappen();

});