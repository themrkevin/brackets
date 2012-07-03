/*
	Author: Kevin Mangubat
*/

var Brack = {}
var playerList = []
var newPlayer,
	playerName,
	playerNumber,
	storedPList,
	parsedPList,
	playerPos,
	$playerListContainer = $('#player-list-container'),
	$playerList = $('#player-list'),
	$brackets = $('#brackets'),
	$listTemplate = $playerList.find('.template'),
	$listItemName = $playerList.find('.list-item-name'),
	$playerCount = $playerList.find('.count'),
	$optionsButton = $playerList.find('.add'),
	$removePlayer = $playerList.find('.remove'),
	$playerForm = $('#player-form'),
	$listControl = $('#list-control'),
	$listToggle = $listControl.find('.list-toggle'),
	$clearAll = $playerListContainer.find('.clear-all'),
	$clearConfirm = $playerListContainer.find('.clear-confirm');

//player constructor
function Player(name) {
	this.name = name;
}


//create players
Brack.createPlayer = function(playerName) {
	
	//this creates the new player and assigns the name
	newPlayer = new Player(playerName);
	console.log('new player has been added: ', newPlayer);

	//inject new player into array
	playerList[playerList.length] = newPlayer;
	console.log('updated list: ', playerList);

	//store playerList locally && reload it as a local object
	localStorage.setItem('playerList', JSON.stringify(playerList));
	Brack.loadPList();

	var thisPosition = (parsedPList.length - 1);
	var thisPlayer = parsedPList[thisPosition];

	Brack.addToList(thisPlayer);
	Brack.playerCount();
	Brack.toggleClear();

}

Brack.loadPList = function() {
	storedPList = localStorage.getItem('playerList');
	parsedPList = JSON.parse(storedPList); 
}

Brack.template = function(item,source) {

	//find && replace template data
	item.find('.list-item-name').text(source.name);
	return item;
}

Brack.addToList = function(thisPlayer) {
	
	//display players to list && clone template
	var $newItem = $listTemplate.clone().removeClass('template');
	Brack.template($newItem,thisPlayer).appendTo(($playerList));
}

Brack.repopulate = function() {

	Brack.loadPList();
	//goes through localStorage and repopulates data
	for ( i = 0; i < parsedPList.length; i++ ) {
		playerList[playerList.length] = parsedPList[i];
		Brack.addToList(parsedPList[i]);
	}
	Brack.playerCount();

}

Brack.toggleOptions = function() {

	//opens the form to add players
	$optionsButton.click(function() {
		if($playerForm.is(':visible')) {
			$(this).removeClass('neg');
			$(this).addClass('pos');
			$playerForm.hide();
			$playerList.find('.remove').addClass('switch');
			$clearAll.addClass('hidden');
		} else {
			$(this).removeClass('pos');
			$(this).addClass('neg');
			$playerForm.show();
			$playerList.find('.remove').removeClass('switch');
			Brack.toggleClear();
		}

		return false;
	});

}

Brack.removePlayer = function() {
	
	$removePlayer.live('click', function(){

		//target the group LI container
		var $liGroup = $(this).parent().parent();

		$liGroup.fadeOut('slow', function(){
			$liGroup.remove();
			Brack.toggleClear();
		});
		
		//find the players Name of selected group
		var $liGroupName = $liGroup.find('.list-item-name').text();
		Brack.valueOfKey($liGroupName);

		console.log('Player position: ', playerPos);
		console.log('removing: ', $liGroupName);

		//remove this player from player list && refresh localStorage
		playerList.splice(playerPos,1);
		localStorage.setItem('playerList', JSON.stringify(playerList));
		Brack.loadPList();
		Brack.playerCount();

		return false;
	});
	
}

Brack.clearAllPlayer = function() {

	$clearAll.click(function() {
		$(this).addClass('hidden');
		$clearConfirm.removeClass('hidden');

		return false;
	});

	$clearConfirm.click(function() {
		return false;
	});

	$clearConfirm.find('.clear').click(function() {
		Brack.clearAllInit();
		$clearAll.addClass('hidden');
		$clearConfirm.addClass('hidden');

	});

	$clearConfirm.find('.cancel').click(function() {
		$clearConfirm.addClass('hidden');
		$clearAll.removeClass('hidden');

		return false;
	});

}

Brack.clearAllInit = function() {

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
	Brack.playerCount();

	return false;

}

Brack.toggleClear = function() {

	//this will check to see if there are any players in the field, if not then the clear button will not display
	if($playerList.find('li:not(".template")').is(':visible')) {
		$clearAll.removeClass('hidden');
	} else {
		$clearAll.addClass('hidden');
	}

}

Brack.valueOfKey = function(value) {
	for(var pos in parsedPList) {
		if(parsedPList[pos].name === value) {
			console.log('found a match to: ', value);

			playerPos = pos;
		}
	}
}

Brack.playerCount = function() {
	$playerCount.text(parsedPList.length);
}

Brack.formTricks = function() {
	
	var $nameField = $playerForm.find('input[name="name"]');
	var $fieldInput;
	var $defaultValue = $nameField.val();
	var $theField = $playerForm.find('input[type="text"]');

	//field focus replace
	$theField.focus(function() {
		if(this.value == this.defaultValue) {
			this.value = '';
		}
		if(this.value != this.defaultValue){  
            this.select();  
        } 
	});

	$theField.blur(function() {
		if($.trim(this.value) == '') {
			this.value = (this.defaultValue ? this.defaultValue : '');
		}
	});

	$playerForm.submit(function() {
		//take the input value of the name field and shove it into the player maker
		$fieldInput = $nameField.val();
		Brack.createPlayer($fieldInput);

		//restore name field to default
		$nameField.val('');

		return false;
	});

}

Brack.thePlayerList = function() {

	$listToggle.click(function() {
		$playerListContainer.fadeToggle('slow');

		return false;
	});

}

Brack.makeItHappen = function() {

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

$(document).ready(function() {

	Brack.makeItHappen();

});