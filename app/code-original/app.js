'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
    'ui.bootstrap'
])
.controller('MainController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.temps = [
        {value: 0, text: "freezing."},
        {value: 1, text: "cold."},
        {value: 2, text: "mild."},
        {value: 3, text: "warm."},
        {value: 4, text: "hot."}
    ];
    $scope.fireStates = [
        {value: 0, text: "dead."},
        {value: 1, text: "smoldering."},
        {value: 2, text: "flickering."},
        {value: 3, text: "burning."},
        {value: 4, text: "roaring."}
    ];

    $scope.builderStates = [
        {value: 0, text: "a ragged stranger stumbles through the door and collapses in the corner."},
        {value: 1, text: "the stranger shivers, and mumbles quietly. her words are unintelligible."},
        {value: 2, text: "the stranger in the corner stops shivering. her breathing calms."},
        {value: 3, text: "the stranger is standing by the fire. she says she can help. says she builds things."}
    ];

    $scope.buildables = [
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
    ];
	
	$scope.trapDrops = [
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
	];
	
    $scope.STOKE_COOLDOWN = 10000;
    $scope.NEED_WOOD_DELAY = 15000;
    $scope.OTHER_DELAY = 30000;

    $scope.story_message_index = 2;

    $scope.storyMessages = [
		{id: 1, txt: "the fire is dead."},
        {id: 0, txt: "the room is freezing."}
    ];

    $scope.stores = {};
    $scope.buildings = {};

    $scope.isForestFound = false;
    $scope.isForestVisited = false;
    $scope.isFireBurning = false;
    $scope.fireText = "light fire";
	$scope.woodText = "gather wood"
	$scope.trapText = "check traps"
    $scope.roomTitle = "A Dark Room";
    $scope.outTitle = "A Silent Forest";

    $scope.isFireCooling = false;
    $scope.isWoodCooling = false;
    $scope.isTrapCooling = false;

    $scope.isTrapButtonVisible = false;
    $scope.isCartButtonVisible = false;
    $scope.isHutButtonVisible = false;

    $scope.isCollapsed = true;

    $scope.fireNow = 0;
    $scope.tempNow = 0;
    $scope.builderNow = -1;
    $scope.currentPopulation = 0;
    $scope.maximumPopulation = 0;

    $scope.stokeFire = function () {

        if (!$scope.isFireBurning) {
            $scope.isFireBurning = true;
            $scope.roomTitle = "A Firelit Room";
			//$scope.makeFireDie();
        }
		$scope.fireText = "wait...";
		if(!$scope.stores.hasOwnProperty('wood')) {
			$scope.isFireCooling = true;
			$scope.updateFire($scope.fireNow +1);

			$timeout(function () {
				$scope.fireText = "stoke fire";
				$scope.isFireCooling = false;
			}, $scope.STOKE_COOLDOWN);
		} else if ($scope.stores.wood > 1) {
			$scope.stores.wood = $scope.stores.wood -1;
			$scope.isFireCooling = true;
			$scope.updateFire($scope.fireNow +1);

			$timeout(function () {
				$scope.fireText = "stoke fire";
				$scope.isFireCooling = false;
			}, $scope.STOKE_COOLDOWN);
		} else {
			$scope.stores.wood = $scope.stores.wood -1;
			$scope.isFireCooling = true;
			$scope.updateFire($scope.fireNow +1);
			$scope.addStoryMessage("the wood runs out");
		}
    };
	
	//somehow fubar's builder, leave out
	/* 
	var fireDying;
	$scope.makeFireDie = function() {
		if (angular.isDefined(fireDying)) return;
		
		fireDying = $interval(function() {
			console.log("fire die" + $scope.fireNow)
			if($scope.fireNow > 1 && $scope.tempNow > 1) {
				$scope.fireNow--;
				$scope.tempNow--;
				
				$scope.addStoryMessage("the fire is " + $scope.fireStates[$scope.fireNow].text);
				$scope.addStoryMessage("the room is " + $scope.temps[$scope.tempNow].text);
			} else {
				$scope.stopFireDying;
			}
		}, $scope.OTHER_DELAY);
	}
	
	$scope.stopFireDying = function() {
        if (angular.isDefined(fireDying)) {
			$interval.cancel(fireDying);
			fireDying = undefined;
        }
    }; 
	*/
	
	//TODO:
	//be grrm, kill villagers, burn huts

    $scope.updateFire = function (newState) {
		console.log(newState);
		if(newState > 4) {
			newState = 4;
		}
        $scope.fireNow = newState;
		$scope.tempNow = newState;
        $scope.addStoryMessage("the fire is " + $scope.fireStates[$scope.fireNow].text);
		$scope.addStoryMessage("the room is " + $scope.temps[$scope.tempNow].text);

        if ($scope.fireNow > 1 && $scope.builderNow < 0) {
            $scope.addStoryMessage("the light from the fire spills from the windows, out into the dark.");

            $timeout(function () {
                $scope.initBuilder();
            }, $scope.OTHER_DELAY);
        }
    };

    $scope.initBuilder = function () {
		$scope.builderNow = 0;
		$scope.addStoryMessage($scope.builderStates[$scope.builderNow].text); //for some reason watch does not see 0, message manually
		//builder 1
        $scope.builderNow = 1;
        $timeout($scope.unlockForest, $scope.NEED_WOOD_DELAY);
		
		$timeout(function() {
			//builder 2
			$scope.builderNow = 2;
		}, $scope.OTHER_DELAY)
		.then(function() {
			return $timeout(function() {
				//builder 3
				$scope.initializeCreature();
			}, $scope.OTHER_DELAY);
		});
    };

    $scope.$watch('builderNow', function () {
		if($scope.builderNow > -1) {
			$scope.addStoryMessage($scope.builderStates[$scope.builderNow].text);
		}
    });

    $scope.initializeCreature = function () {
		$scope.builderNow = 3;
		$scope.addStoryMessage("something is scraping near the door.");

            var trap = $scope.buildables[0];
			$scope.buildings.trap = 0;
            $scope.isTrapButtonVisible = true;
            $scope.addStoryMessage(trap.text);
    };
	
	$scope.$watchCollection('buildings', function(val) {
		console.log("build change " + $scope.buildings.hasOwnProperty('hut'));
		if($scope.buildings.hasOwnProperty('hut')) {
			console.log($scope.buildings.hut);
			$scope.maximumPopulation = $scope.getMaximumPopulation();
			$scope.setOutsideTitle();
		}
	});
	
	$scope.setOutsideTitle = function() {
		var huts = $scope.buildings.hut;
		if(huts === 0) {
			$scope.outTitle = "A Silent Forest";
		} else if(huts === 1) {
			$scope.outTitle ="A Lonely Hut";
		} else if(huts <= 4) {
			$scope.outTitle ="A Tiny Village";
		} else if(huts <= 8) {
			$scope.outTitle ="A Modest Village";
		} else if(huts <= 14) {
			$scope.outTitle ="A Large Village";
		} else {
			$scope.outTitle ="A Raucous Village";
		}		
	};
	
    $scope.createAnotherTrap = function () {
		var trap = $scope.buildings.hasOwnProperty('trap');
        if ($scope.tempNow < 2) {
            $scope.addStoryMessage("the builder only shivers.");
        } else {
			var cost = $scope.getTrapCost();
			if(!$scope.stores.hasOwnProperty('wood') || $scope.stores.wood < cost) {
				$scope.addStoryMessage("not enough wood.");
			} else if($scope.buildings.trap === $scope.buildables[0].maximum) {
				$scope.addStoryMessage($scope.buildables[0].maxMsg);
			} else {
				$scope.addStoryMessage($scope.buildables[0].buildMsg);
				$scope.buildings.trap++;
				$scope.stores.wood = $scope.stores.wood - cost;
			}
        }
    };

	$scope.getTrapCost = function() {
		if(!$scope.buildings.hasOwnProperty('trap')) {
			return 10;
		} else {
			return $scope.buildings.trap * 10 + 10;
		}
	};

    $scope.createCart = function () {
        if ($scope.tempNow < 2) {
            $scope.addStoryMessage("the builder only shivers.");
        } else {
            var cost = 30;
			if(!$scope.stores.hasOwnProperty('wood') || $scope.stores.wood < cost) {
				$scope.addStoryMessage("not enough wood.");
			} else if($scope.buildings.cart === $scope.buildables[1].maximum) {
				$scope.addStoryMessage($scope.buildables[1].maxMsg);
			} else {
				$scope.addStoryMessage($scope.buildables[1].buildMsg);
				$scope.buildings.cart = 1;
				$scope.stores.wood = $scope.stores.wood - cost;
			}
        }
    };
	
	$scope.$watchCollection('stores', function (val) {
		if(val !== undefined && val.hasOwnProperty('wood') && val.wood > 30) {
			$scope.isCartButtonVisible = true;
			if(!$scope.buildings.hasOwnProperty('cart')) {
				$scope.addStoryMessage($scope.buildables[1].text);
				$scope.buildings.cart = 0;
			}
		}
		if(val !== undefined && val.hasOwnProperty('wood') && val.wood > 100) {
			$scope.isHutButtonVisible = true;
			if(!$scope.buildings.hasOwnProperty('hut')) {
				$scope.addStoryMessage($scope.buildables[2].text);
				$scope.buildings.hut = 0;
			}
		}
    });

    $scope.createHut = function () {
        if ($scope.tempNow < 2) {
            $scope.addStoryMessage("the builder only shivers.");
        } else {
            var cost = $scope.getHutCost();
			if(!$scope.stores.hasOwnProperty('wood') || $scope.stores.wood < cost) {
				$scope.addStoryMessage("not enough wood.");
			} else if($scope.buildings.hut === $scope.buildables[2].maximum) {
				$scope.addStoryMessage($scope.buildables[2].maxMsg);
			} else {
				$scope.addStoryMessage($scope.buildables[2].buildMsg);
				$scope.buildings.hut++;
				$scope.stores.wood = $scope.stores.wood - cost;
			}
			//people shouldn't come every time we build a hut, that's boring.
			var peopleComingNow = Math.random();
			if(peopleComingNow > 0.4) {
				$scope.increasePopulation();
			}
        }
    };
	
	$scope.getHutCost = function() {
		if(!$scope.buildings.hasOwnProperty('hut')) {
			return 100;
		} else {
			return $scope.buildings.hut * 100 + 50;
		}
	};
	
	$scope.increasePopulation = function() {
		var space = $scope.maximumPopulation - $scope.currentPopulation;
		if(space > 0) {
			var arrivals = Math.floor(Math.random()*(space/2));
			if(arrivals === 0) arrivals = 1;
			if(arrivals == 1) {
				$scope.addStoryMessage('a stranger arrives in the night');
			} else if(arrivals < 5) {
				$scope.addStoryMessage('a weathered family takes up in one of the huts.');
			} else if(arrivals < 10) {
				$scope.addStoryMessage('a small group arrives, all dust and bones.');
			} else if(arrivals < 30) {
				$scope.addStoryMessage('a convoy lurches in, equal parts worry and hope.');
			} else {
				$scope.addStoryMessage("the town's booming. word does get around.");
			}
			$scope.currentPopulation += arrivals;
		}
	};

    $scope.gatherWood = function () {
        $scope.addStoryMessage("dry brush and dead branches litter the forest floor.");

        var gatherAmount = 0;
        if (!$scope.buildings.hasOwnProperty('cart')) {
            gatherAmount = 10;
        } else {
            gatherAmount = 50;
        }

        if (!$scope.stores.hasOwnProperty('wood')) {
            $scope.stores.wood = gatherAmount;
        } else {
            $scope.stores.wood = $scope.stores.wood + gatherAmount;
        }

        $scope.isWoodCooling = true;
		$scope.woodText = "wait...";
        $timeout(function () {
            $scope.isWoodCooling = false;
			$scope.woodText = "gather wood";
        }, $scope.OTHER_DELAY);
    };
	
	$scope.checkTraps = function () {
		var caught = [];
		var numberOfTraps = $scope.buildings.trap;
		
		angular.forEach($scope.trapDrops, function(drop) {
			var roll = Math.floor(Math.random()*drop.multiplier*numberOfTraps);
			caught.push({name: drop.name, message: drop.message, amount:roll});
		});
		console.log(caught);
		
		var catchText = "the traps contain ";
		var list;
		angular.forEach(caught, function(c) {
			if(c.amount > 0) {
				if(typeof list === 'undefined') {
					list = c.message;
				} else {
					list = list.concat(", ", c.message);
				}
			}
		});
		if(list === "") {
			catchText = "nothing in traps";
		} else {
			catchText += list;
		}
		$scope.addStoryMessage(catchText);
		
		angular.forEach(caught, function(c) {
			if($scope.stores.hasOwnProperty(c.name)) {
				var n =c.name
				$scope.stores[n] += c.amount;
			} else {
				var n =c.name
				$scope.stores[n] = c.amount;
			}
		});
		
		$scope.isTrapCooling = true;
		$scope.trapText = "wait...";
        $timeout(function () {
            $scope.isTrapCooling = false;
			$scope.trapText = "check traps";
        }, $scope.OTHER_DELAY);	
	}; 

    $scope.arriveToForest = function () {
        if (!$scope.isForestVisited) {
            $scope.addStoryMessage("the sky is grey and the wind blows relentlessly.");
            $scope.isForestVisited = true;
        }
    };

    $scope.unlockForest = function () {
        $scope.stores.wood = 4;
        //$scope.stores.push({thing:"wood", amount:4}); //which one?
        $scope.isForestFound = true;
        $scope.addStoryMessage("the wind howls outside.");
        $scope.addStoryMessage("the wood is running out.");
    };

    $scope.getMaximumPopulation = function () {
        if(!$scope.buildings.hasOwnProperty('hut')) {
            return 0;
        } else {
            return $scope.buildings.hut * 4;
        }
    };

    $scope.addStoryMessage = function (text) {
        //ng-repeat does not like multiples of same message, so they must be wrapped in an object
        var messageObject = {id: $scope.story_message_index, txt: text};
        $scope.story_message_index++;
        $scope.storyMessages.unshift(messageObject);
    };
}]);