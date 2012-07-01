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

	var thisPlayer = playerList[(playerList.length - 1)];

	//display players to list && copy template
	var $newItem = $listTemplate.clone().removeClass('template');
	tBrack.template($newItem,thisPlayer).appendTo(($playerList));

}

tBrack.template = function(item,source) {

	//find && replace template data
	item.find('.list-item-name').text(source.name);

	return item;
}



