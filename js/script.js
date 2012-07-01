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
	$playerList = $('#player-list'),
	$brackets = $('#brackets'),
	$listTemplate = $playerList.find('.template'),
	$listItemName = $playerList.find('.list-item-name'),
	$playerCount = $playerList.find('.count'),
	$addPlayer = $playerList.find('.add'),
	$removePlayer = $playerList.find('.remove');

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

tBrack.removePlayer = function() {
	
	$('.remove').click(function(){
		console.log('removal ahoy!');
		return false;
	});
	
}

tBrack.playerCount = function() {
	$playerCount.text(parsedPList.length);
}

$(document).ready(function() {

	if(localStorage.length !== 0) {
		tBrack.repopulate();
	} else {
		console.log('localStorage is empty');
	}

	tBrack.removePlayer();

});