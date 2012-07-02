/*
	Author: Kevin Mangubat
*/

var tBrack = {}
var playerList = []
var newPlayer,
	playerName,
	playerNumber,
	storedPList,
	parsedPList,
	playerPos,
	$playerList = $('#player-list'),
	$brackets = $('#brackets'),
	$listTemplate = $playerList.find('.template'),
	$listItemName = $playerList.find('.list-item-name'),
	$playerCount = $playerList.find('.count'),
	$optionsButton = $playerList.find('.add'),
	$removePlayer = $playerList.find('.remove'),
	$playerForm = $('#player-form'),
	$listControl = $('#list-control'),
	$listToggle = $listControl.find('.list-toggle');

//player constructor
function Player(name) {
	this.name = name;
}


//create players
tBrack.createPlayer = function(playerName) {
	
	//this creates the new player and assigns the name
	newPlayer = new Player(playerName);
	console.log('new player has been added: ', newPlayer);

	//inject new player into array
	playerList[playerList.length] = newPlayer;
	console.log('updated list: ', playerList);

	//store playerList locally && reload it as a local object
	localStorage.setItem('playerList', JSON.stringify(playerList));
	tBrack.loadPList();

	var thisPosition = (parsedPList.length - 1);
	var thisPlayer = parsedPList[thisPosition];

	tBrack.addToList(thisPlayer);
	tBrack.playerCount();
	//tBrack.removePlayer();

}

tBrack.loadPList = function() {
	storedPList = localStorage.getItem('playerList');
	parsedPList = JSON.parse(storedPList); 
}

tBrack.template = function(item,source) {

	//find && replace template data
	item.find('.list-item-name').text(source.name);
	return item;
}

tBrack.addToList = function(thisPlayer) {
	
	//display players to list && clone template
	var $newItem = $listTemplate.clone().removeClass('template');
	tBrack.template($newItem,thisPlayer).appendTo(($playerList));
}

tBrack.repopulate = function() {

	tBrack.loadPList();
	//goes through localStorage and repopulates data
	for ( i = 0; i < parsedPList.length; i++ ) {
		playerList[playerList.length] = parsedPList[i];
		tBrack.addToList(parsedPList[i]);
	}
	tBrack.playerCount();

}

tBrack.toggleOptions = function() {

	//opens the form to add players
	$optionsButton.click(function() {
		if(($playerForm.is(':visible'))) {
			$(this).removeClass('neg');
			$(this).addClass('pos');
			$playerForm.hide();
			$playerList.find('.remove').addClass('switch');
		} else {
			$(this).removeClass('pos');
			$(this).addClass('neg');
			$playerForm.show();
			$playerList.find('.remove').removeClass('switch');
		}
		return false;
	});

}

tBrack.setRemovePlayer = function() {

}

tBrack.removePlayer = function() {
	
	$removePlayer.live('click', function(){

		//target the group LI container
		var $liGroup = $(this).parent().parent();

		$liGroup.fadeOut('slow', function(){
			$liGroup.remove();
		});
		
		//find the players Name of selected group
		var $liGroupName = $liGroup.find('.list-item-name').text();
		tBrack.valueOfKey($liGroupName);

		console.log('Player position: ', playerPos);
		console.log('removing: ', $liGroupName);

		//remove this player from player list && refresh localStorage
		playerList.splice(playerPos,1);
		localStorage.setItem('playerList', JSON.stringify(playerList));
		tBrack.loadPList();
		tBrack.playerCount();

		return false;
	});
	
}

tBrack.valueOfKey = function(value) {
	for(var pos in parsedPList) {
		if(parsedPList[pos].name === value) {
			console.log('found a match to: ', value);

			playerPos = pos;
		}
	}
}

tBrack.playerCount = function() {
	$playerCount.text(parsedPList.length);
}

tBrack.formTricks = function() {
	
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
		tBrack.createPlayer($fieldInput);

		//restore name field to default
		$nameField.val('');

		return false;
	});

}

tBrack.thePlayerList = function() {

	$listToggle.click(function() {
		$playerList.fadeToggle('slow');

		return false;
	});

}

tBrack.makeItHappen = function() {

	if(localStorage.length !== 0) {
		tBrack.repopulate();
	} else {
		console.log('localStorage is empty');
	}

	tBrack.toggleOptions();
	tBrack.removePlayer();
	tBrack.formTricks();
	tBrack.thePlayerList();

}

$(document).ready(function() {

	tBrack.makeItHappen();

});