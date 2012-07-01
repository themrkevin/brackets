/*
	Author: Kevin Mangubat
*/

var tBrack = {}
var playerList = []
var newPlayer,
	playerName,
	playerNumber,
	$playerList = $('#player-list'),
	$brackets = $('#brackets'),
	$listTemplate = $playerList.find('.template'),
	$listItemName = $playerList.find('.list-item-name');

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

	var thisPosition = (playerList.length - 1);
	var thisPlayer = playerList[thisPosition];

	localStorage.setItem('playerList[' + thisPosition + ']', thisPlayer.name);

	tBrack.addToList(thisPosition);
}

tBrack.template = function(item,source) {

	//find && replace template data
	item.find('.list-item-name').text(localStorage.getItem('playerList[' + source + ']'));

	return item;
}

tBrack.addToList = function(thisPosition) {
	
	//display players to list && clone template
	var $newItem = $listTemplate.clone().removeClass('template');
	tBrack.template($newItem,thisPosition).appendTo(($playerList));
}

tBrack.repopulate = function() {
	for ( i = 0; i < localStorage.length; i++ ) {
		playerList[playerList.length] = localStorage.getItem('playerList[' + i + ']');

		tBrack.addToList(i);
	}

}

$(document).ready(function() {
	if(localStorage.length !== 0) {
		tBrack.repopulate();
	} else {
		console.log('localStorage is empty');
	}
});