'use strict';

var myApp = angular.module('myApp', [
	'ui.bootstrap'
])
.constant("hardcode", {
	"temperatures": [
		"freezing.",
		"cold.",
		"mild.",
		"warm.",
		"hot."
	],
	"fireStates": [
		"dead.",
		"smoldering.",
		"flickering.",
		"burning.",
		"roaring."
	],
	"builderMessages": [
		"a ragged stranger stumbles through the door and collapses in the corner.",
		"the stranger shivers, and mumbles quietly. her words are unintelligible.",
		"the stranger in the corner stops shivering. her breathing calms.",
		"the stranger is standing by the fire. she says she can help. says she builds things."
	],
	"outsideTitles": [
		{maximum: 0, text:"A Silent Forest"},
		{maximum: 1, text:"A Lonely Hut"},
		{maximum: 4, text:"A Tiny Village"},
		{maximum: 8, text:"A Modest Village"},
		{maximum: 14, text:"A Large Village"},
		{maximum: 20, text:"A Raucous Village"}
	],
	"arrivalMessages": [
		{max:2, message:'a stranger arrives in the night'},
		{max:5, message:'a weathered family takes up in one of the huts.'},
		{max:10, message:'a small group arrives, all dust and bones.'},
		{max:30, message:'a convoy lurches in, equal parts worry and hope.'},
		{max:100, message:"the town's booming. word does get around."}
	],
	"buildables": [
		{
			name: "trap",
			maximum: 10,
			text: "builder says she can make traps to catch any creatures might still be alive out there.",
			buildMsg: 'more traps to catch more creatures.',
			maxMsg: "more traps won't help now."
		},
		{
			name: "cart",
			maximum: 1,
			text: 'builder says she can make a cart for carrying wood.',
			buildMsg: 'the rickety cart will carry more wood from the forest.',
			maxMsg: "one cart is enough."
		},
		{
			name: "hut",
			maximum: 20,
			text: "builder says there are more wanderers. says they'll work, too.",
			buildMsg: 'builder puts up a hut, out in the forest. says word will get around.',
			maxMsg: 'no more room for huts.'
		}
	],
	"trapDrops": [
		{
			multiplier: 4,
			name: 'fur',
			message: 'scraps of fur'
		},
		{
			multiplier: 3,
			name: 'meat',
			message: 'bits of meat'
		},
		{
			multiplier: 2,
			name: 'scales',
			message: 'strange scales'
		},
		{
			multiplier: 1,
			name: 'teeth',
			message: 'scattered teeth'
		}
	],
	"fireText": "stoke fire",
	"woodText": "gather wood",
	"trapText": "check traps",
	"stokeCooldown": 10000,
	"needWoodDelay": 15000,
	"otherDelay": 30000
})
.controller('MainCtrl', ['$scope', '$timeout', 'hardcode', function ($scope, $timeout, hardcode) {

	$scope.storyMessages = [
		"the room is freezing.",
		"the fire is dead."
	];

	$scope.stores = {};
	$scope.buildings = {};
	
	$scope.room = {
		title: "A Dark Room",
		
		isFireBurning: false,
		isFireCooling: false,
		fireText: "light fire",
		fireNow: 0,
		
		builderIsComing: false
	};
	
	$scope.outside = {
		title: "A Silent Forest",
		
		isForestFound: false,
		isForestVisited: false,
		
		currentPopulation: 0,
		maximumPopulation: 0,
		
		woodText: "gather wood",
		trapText: "check traps",
		isWoodCooling: false,
		isTrapCooling: false
	};

	$scope.isTrapButtonVisible = false;
	$scope.isCartButtonVisible = false;
	$scope.isHutButtonVisible = false;
	$scope.isStoresVisible = false;

	$scope.isCollapsed = true;

	$scope.stokeFire = function () {
		if (!$scope.room.isFireBurning) {
			$scope.startFire();
		}
		$scope.room.fireText = "wait...";
		if(!$scope.stores.hasOwnProperty('wood')) {
			$scope.startCooldownAndUpdateFire();

			$timeout($scope.endFireCooldown, hardcode.stokeCooldown);
		} else if ($scope.stores.wood > 1) {
			$scope.stores.wood = $scope.stores.wood -1;
			$scope.startCooldownAndUpdateFire();

			$timeout($scope.endFireCooldown, hardcode.stokeCooldown);
		} else {
			$scope.stores.wood = $scope.stores.wood -1;
			$scope.startCooldownAndUpdateFire();
			
			$scope.addStoryMessage("the wood runs out");
		}
	};
		
	$scope.startFire = function() {
		$scope.room.isFireBurning = true;
		$scope.room.title = "A Firelit Room";
	};
	
	$scope.endFireCooldown = function() {
		$scope.room.fireText = hardcode.fireText;
		$scope.room.isFireCooling = false;
	}
	
	$scope.startCooldownAndUpdateFire = function() {
		$scope.room.isFireCooling = true;
		$scope.updateFire($scope.room.fireNow +1);
	};
		
	$scope.updateFire = function (newState) {
		if(newState > 4) {
			newState = 4;
		}
		$scope.room.fireNow = newState;
		$scope.addStoryMessage("the fire is " + hardcode.fireStates[$scope.room.fireNow]);
		$scope.addStoryMessage("the room is " + hardcode.temperatures[$scope.room.fireNow]);

		$scope.initializeBuilderIfNotYetDone();
	};
	
	$scope.initializeBuilderIfNotYetDone = function() {
		if (!$scope.room.builderIsComing && $scope.room.fireNow > 1) {
			$scope.addStoryMessage("the light from the fire spills from the windows, out into the dark.");
			$scope.room.builderIsComing = true;
			$timeout($scope.initializeBuilder, hardcode.otherDelay);
		}
	};

	$scope.initializeBuilder = function () {
		$scope.addStoryMessage(hardcode.builderMessages[0]);
		$scope.addStoryMessage(hardcode.builderMessages[1]);
		$timeout($scope.unlockForest, hardcode.needWoodDelay);
		
		$timeout(function() {
			$scope.addStoryMessage(hardcode.builderMessages[2]);
		}, hardcode.otherDelay)
		.then(function() {
			return $timeout($scope.initializeCreature, hardcode.otherDelay);
		});
	};

	$scope.unlockForest = function () {
		$scope.stores.wood = 4;
		$scope.isStoresVisible = true;
		$scope.outside.isForestFound = true;
		$scope.addStoryMessage("the wind howls outside.");
		$scope.addStoryMessage("the wood is running out.");
	};
	
	$scope.initializeCreature = function () {
		$scope.addStoryMessage(hardcode.builderMessages[3]);
		$scope.addStoryMessage("something is scraping near the door.");
		
		var trap = hardcode.buildables[0];
		$scope.buildings.trap = 0;
		$scope.isTrapButtonVisible = true;
		$scope.addStoryMessage(trap.text);
	};
	
	$scope.$watchCollection('buildings', function(val) {
		if($scope.buildings.hasOwnProperty('hut')) {
			$scope.outside.maximumPopulation = $scope.outside.getMaximumPopulation();
			$scope.setOutsideTitle();
		}
	});
	
	$scope.getMaximumPopulation = function () {
		if(!$scope.buildings.hasOwnProperty('hut')) {
			return 0;
		} else {
			return $scope.buildings.hut * 4;
		}
	};
	
	$scope.setOutsideTitle = function() {
		for(var i=0; i<hardcode.outsideTitles.length;i++) {
			var title = hardcode.outsideTitles[i];
			$scope.outside.title = title.text;
			if($scope.buildings.hut <= title.maximum) {
				break;
			}
		}
	};
	
	$scope.createTrap = function () {
		$scope.createBuilding(0, 'trap');
	};
	
	$scope.createCart = function () {
		$scope.createBuilding(1, 'cart');
	};
	
	$scope.createHut = function () {
		$scope.createBuilding(2, 'hut');
	};
	
	$scope.createBuilding = function(buildableIndex, type) {
		if ($scope.room.fireNow < 2) {
			$scope.addStoryMessage("the builder only shivers.");
		} else {
			$scope.handleBuilding(buildableIndex, type);
		}
	};
	
	$scope.handleBuilding = function(buildableIndex, type) {
		var cost = $scope.getCost(type);
		if(!$scope.stores.hasOwnProperty('wood') || $scope.stores.wood < cost) {
			$scope.addStoryMessage("not enough wood.");
		} else if($scope.buildings[type] === hardcode.buildables[buildableIndex].maximum) {
			$scope.addStoryMessage(hardcode.buildables[buildableIndex].maxMsg);
		} else {
			$scope.addStoryMessage(hardcode.buildables[buildableIndex].buildMsg);
			$scope.buildings[type]++;
			$scope.stores.wood = $scope.stores.wood - cost;
			
			$scope.increasePopIfNeeded(type);
		}
	};
	
	$scope.getCost = function(type) {
		var cost;
		if('trap' === type) {
			cost = $scope.getTrapCost();
		} else if ('cart' === type) {
			cost = $scope.getCartCost();
		} else {
			cost = $scope.getHutCost();
		}
		return cost;
	};
	
	$scope.getTrapCost = function() {
		if(!$scope.buildings.hasOwnProperty('trap')) {
			return 10;
		} else {
			return $scope.buildings.trap * 10 + 10;
		}
	};
	
	$scope.getCartCost = function() {
		return 30;
	};
	
	$scope.getHutCost = function() {
		if(!$scope.buildings.hasOwnProperty('hut')) {
			return 100;
		} else {
			return $scope.buildings.hut * 100 + 50;
		}
	};
	
	$scope.increasePopIfNeeded = function(type) {
		if('hut' === type) {
			var peopleComingNow = $scope.getRandomUpTo(1);
			if(peopleComingNow > 0.4) {
				$scope.increasePopulation();
			}
		}
	};
	
	$scope.increasePopulation = function() {
		var space = $scope.outside.maximumPopulation - $scope.outside.currentPopulation;
		if(space > 0) {
			var arrivals = $scope.getArrivals(space);
			var message = $scope.getArrivalMessage(arrivals);
			$scope.addStoryMessage(message);
			$scope.outside.currentPopulation += arrivals;
		}
	};
	
	$scope.getArrivals = function(space) {
		var arrivals = $scope.getRandomUpTo(space/2);
		if(arrivals === 0) {
			arrivals = 1;
		}
		return arrivals;
	};
	
	$scope.getArrivalMessage = function(numberOfArrivals) {
		var message = "";
		for(var i=0; i<hardcode.arrivalMessages.length; i++) {
			message = hardcode.arrivalMessages[i].message;
			if(numberOfArrivals < hardcode.arrivalMessages[i].max) {
				break;
			}
		}
		return message;
	};
	
	$scope.$watchCollection('stores', function (val) {
		if(val !== undefined && val.hasOwnProperty('wood') && val.wood > 30) {
			$scope.isCartButtonVisible = true;
			if(!$scope.buildings.hasOwnProperty('cart')) {
				$scope.addStoryMessage(hardcode.buildables[1].text);
				$scope.buildings.cart = 0;
			}
		}
		if(val !== undefined && val.hasOwnProperty('wood') && val.wood > 100) {
			$scope.isHutButtonVisible = true;
			if(!$scope.buildings.hasOwnProperty('hut')) {
				$scope.addStoryMessage(hardcode.buildables[2].text);
				$scope.buildings.hut = 0;
			}
		}
	});

	$scope.gatherWood = function () {
		$scope.addStoryMessage("dry brush and dead branches litter the forest floor.");

		var gatherAmount = $scope.getGatherAmount();
		if (!$scope.stores.hasOwnProperty('wood')) {
			$scope.stores.wood = gatherAmount;
		} else {
			$scope.stores.wood = $scope.stores.wood + gatherAmount;
		}

		$scope.outside.isWoodCooling = true;
		$scope.outside.woodText = "wait...";
		$timeout($scope.endWoodCooldown, hardcode.otherDelay);
	};
	
	$scope.getGatherAmount = function() {
		if (!$scope.buildings.hasOwnProperty('cart')) {
			return 10;
		} else {
			return 50;
		}
	};
	
	$scope.endWoodCooldown = function() {
		$scope.outside.isWoodCooling = false;
		$scope.outside.woodText = hardcode.woodText;
	};
	
	$scope.checkTraps = function () {
		var caught = $scope.getYields();
		
		$scope.addTrapsMessage(caught);
		$scope.addCaughtToStores(caught);
		
		$scope.setTrapCoolDown();
		$timeout($scope.endTrapCooldown, hardcode.otherDelay);	
	}; 
	
	$scope.getYields = function() {
		var caught = [];
		var numberOfTraps = $scope.buildings.trap;
		
		angular.forEach(hardcode.trapDrops, function(drop) {
			var roll = $scope.getRandomUpTo(drop.multiplier*numberOfTraps);
			caught.push({name: drop.name, message: drop.message, amount:roll});
		});
		return caught;
	};
	
	$scope.addTrapsMessage = function(caught) {
		var list = $scope.listTrapYields(caught);
		var catchText;
		if(typeof list === 'undefined') {
			catchText = "nothing in traps";
		} else {
			catchText = "the traps contain " + list;
		}
		$scope.addStoryMessage(catchText);
	};
	
	$scope.listTrapYields = function(trapContents) {
		var list;
		angular.forEach(trapContents, function(c) {
			if(c.amount > 0) {
				if(typeof list === 'undefined') {
					list = c.message;
				} else {
					list = list.concat(", ", c.message);
				}
			}
		});
		return list;
	};
	
	$scope.addCaughtToStores = function(caught) {
		angular.forEach(caught, function(c) {
			var name =c.name
			if($scope.stores.hasOwnProperty(name)) {
				$scope.stores[name] += c.amount;
			} else {
				$scope.stores[name] = c.amount;
			}
		});
	};
	
	$scope.setTrapCoolDown = function() {
		$scope.outside.isTrapCooling = true;
		$scope.outside.trapText = "wait...";
	};
		
	$scope.endTrapCooldown = function(){
		$scope.outside.isTrapCooling = false;
		$scope.outside.trapText = hardcode.trapText;
	};
	
	$scope.arriveToForest = function () {
		if (!$scope.outside.isForestVisited) {
			$scope.addStoryMessage("the sky is grey and the wind blows relentlessly.");
			$scope.outside.isForestVisited = true;
		}
	};
	
	$scope.getRandomUpTo = function(limit) {
		return Math.floor(Math.random()*(limit));
	};

	$scope.addStoryMessage = function (text) {
		$scope.storyMessages.unshift(text);
	};
}]);