describe('MainController', function() {

  beforeEach(module('myApp'));
  var scope, $timeout, createController;
  beforeEach(inject(function ($rootScope, $controller, _$location_, _$timeout_) {
    $timeout = _$timeout_;
    scope = $rootScope.$new();

    createController = function() {
      return $controller('MainCtrl', {
        '$scope': scope
      });
    };
  }));

  describe("the method stokeFire", function() {
	  it("should start fire when there is none", function() {
		  createController();
		  scope.room = {isFireBurning: false};
		  scope.stokeFire();
		  expect(scope.room.isFireBurning).toBe(true);
		  expect(scope.room.title).toBe("A Firelit Room");
	  });
	  
	  it("should remove 1 wood when wood exists", function() {
		  createController();
		  scope.room = {isFireBurning: true};
		  scope.stores = {wood: 2};
		  scope.stokeFire();
		  expect(scope.stores.wood).toBe(1);
	  });
	  
	  it("should set isFireCooling to true when wood is 1", function() {
		  createController();
		  scope.room = {isFireBurning: true};
		  scope.stores = {wood: 1};
		  scope.stokeFire();
		  expect(scope.room.isFireCooling).toBe(true);
	  });
	  
	  it("should add message 'the wood runs out' when wood is 1", function() {
		  createController();
		  scope.room = {isFireBurning: true};
		  scope.storyMessages = [];
		  scope.stores = {wood: 1};
		  scope.stokeFire();
		  expect(scope.storyMessages[0]).toBe('the wood runs out');
	  });
  });
  
  describe("the method initializeBuilder", function() {
	  it("should add two story messages", function () {
		  createController();
		  scope.storyMessages = [];
		  scope.initializeBuilder();
		  expect(scope.storyMessages.length).toBe(2);
    });
  });
  
  describe("the method updateFire", function () {
    it("should set fireNow to the parameter given", function () {
      createController();
	  scope.updateFire(1);
	  expect(scope.room.fireNow).toBe(1);
    });

    it("should set fireNow to 4 when parameter given if bigger than 4", function () {
      createController();
	  scope.updateFire(5);
	  expect(scope.room.fireNow).toBe(4);
    });

    it("should add two story messages", function () {
      createController();
      scope.storyMessages = [];
	  scope.updateFire(1);
	  expect(scope.storyMessages.length).toBe(2);
    });

    it("should add three story messages when parameter is over 1 and builderNow is less than 0", function () {
      createController();
      scope.storyMessages = [];
	  scope.updateFire(3);
	  expect(scope.storyMessages.length).toBe(3);
    });
  });
  
  describe("the method initializeCreature", function () {
    it("should add three story messages", function () {
      createController();
      scope.storyMessages = [];
	  scope.initializeCreature();
	  expect(scope.storyMessages.length).toBe(3);
    });

    it("should set the buildings property trap to 0", function () {
      createController();
      scope.buildings = {};
	  scope.initializeCreature();
	  expect(scope.buildings.trap).toBe(0);
    });

    it("should set the trap button to visible", function () {
      createController();
	  scope.initializeCreature();
	  expect(scope.isTrapButtonVisible).toBe(true);
    });
  });
  
  describe("the method setOutSideTitle", function () {
    it("should be 'A Silent Forest' when there are 0 huts", function () {
      createController();
      scope.buildings = {hut:0};
	  scope.setOutsideTitle();
	  expect(scope.outside.title).toBe("A Silent Forest");
    });

    it("should be 'A Lonely Hut' when there is 1 hut", function () {
      createController();
      scope.buildings = {hut:1};
	  scope.setOutsideTitle();
	  expect(scope.outside.title).toBe("A Lonely Hut");
    });

    it("should be 'A Tiny Village' when there are 4 huts", function () {
      createController();
      scope.buildings = {hut:4};
	  scope.setOutsideTitle();
	  expect(scope.outside.title).toBe("A Tiny Village");
    });

    it("should be 'A Modest Village' when there are 8 huts", function () {
      createController();
      scope.buildings = {hut:8};
	  scope.setOutsideTitle();
	  expect(scope.outside.title).toBe("A Modest Village");
    });

    it("should be 'A Large Village' when there are 14 huts", function () {
      createController();
      scope.buildings = {hut:14};
      scope.setOutsideTitle();
      expect(scope.outside.title).toBe("A Large Village");
    });

    it("should be 'A Raucous Village' when there are 15 huts", function () {
      createController();
      scope.buildings = {hut:15};
      scope.setOutsideTitle();
      expect(scope.outside.title).toBe("A Raucous Village");
    });
  });

  describe("the method createTrap", function () {
    it("should message 'the builder only shivers' when temperature is 1", function () {
      createController();
      scope.room.fireNow = 1;
      scope.createTrap();
      expect(scope.storyMessages[0]).toBe("the builder only shivers.");
    });

    it("should message 'not enough wood' if there is no wood", function () {
      createController();
      scope.room.fireNow = 3;
      scope.stores = {};
      scope.createTrap();
      expect(scope.storyMessages[0]).toBe("not enough wood.");
    });

    it("should message 'not enough wood' for first trap if wood is under 10", function () {
      createController();
      scope.room.fireNow = 3;
      scope.stores = {wood:9};
      scope.createTrap();
      expect(scope.storyMessages[0]).toBe("not enough wood.");
    });

    it("should message 'more traps won't help now.' if the max number of traps is reached", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {trap:10};
      scope.stores = {wood:300};
      scope.createTrap();
      expect(scope.storyMessages[0]).toBe("more traps won't help now.");
    });

    it("should add a trap creation message when one is created", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {};
      scope.stores = {wood:30};
      scope.createTrap();
      expect(scope.storyMessages[0]).toBe("more traps to catch more creatures.");
    });

    it("should add trap to buildings when one is created", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {trap:1};
      scope.stores = {wood:30};
      scope.createTrap();
      expect(scope.buildings.trap).toBe(2);
    });

    it("should remove 10 wood from stores when creating first trap", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {};
      scope.stores = {wood:10};
      scope.createTrap();
      expect(scope.stores.wood).toBe(0);
    });
  });

  describe("the method getTrapCost", function () {
    it("should return 10 when there are no traps", function () {
      createController();
      scope.buildings = {};
      expect(scope.getTrapCost()).toBe(10);
    });

    it("should return 20 when there is 1 trap", function () {
      createController();
      scope.buildings = {trap:1};
      expect(scope.getTrapCost()).toBe(20);
    });
  });

  describe("the method createCart", function () {
    it("should message 'the builder only shivers' when temperature is 1", function () {
      createController();
      scope.room.fireNow = 1;
      scope.createCart();
      expect(scope.storyMessages[0]).toBe("the builder only shivers.");
    });

    it("should message 'not enough wood' if there is no wood", function () {
      createController();
      scope.room.fireNow = 3;
      scope.stores = {};
      scope.createCart();
      expect(scope.storyMessages[0]).toBe("not enough wood.");
    });

    it("should message 'not enough wood' if wood is under 30", function () {
      createController();
      scope.room.fireNow = 3;
      scope.stores = {wood:29};
      scope.createCart();
      expect(scope.storyMessages[0]).toBe("not enough wood.");
    });

    it("should message 'one cart is enough.' if a cart already exists", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {cart:1};
      scope.stores = {wood:30};
      scope.createCart();
      expect(scope.storyMessages[0]).toBe("one cart is enough.");
    });

    it("should add a cart creation message if one is created", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {};
      scope.stores = {wood:30};
      scope.createCart();
      expect(scope.storyMessages[0]).toBe("the rickety cart will carry more wood from the forest.");
    });

    it("should add a cart to buildings when one is created", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {cart:0};
      scope.stores = {wood:30};
      scope.createCart();
      expect(scope.buildings.cart).toBe(1);
    });

    it("should remove 30 wood from stores when cart is created", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {};
      scope.stores = {wood:30};
      scope.createCart();
      expect(scope.stores.wood).toBe(0);
    });
  });

  describe("the method createHut", function () {
    it("should message 'the builder only shivers' when temperature is 1", function () {
      createController();
      scope.room.fireNow = 1;
      scope.createHut();
      expect(scope.storyMessages[0]).toBe("the builder only shivers.");
    });

    it("should message 'not enough wood' if there is no wood", function () {
      createController();
      scope.room.fireNow = 3;
      scope.stores = {};
      scope.createHut();
      expect(scope.storyMessages[0]).toBe("not enough wood.");
    });

    it("should message 'not enough wood' if wood is under 100", function () {
      createController();
      scope.room.fireNow = 3;
      scope.stores = {wood:99};
      scope.createHut();
      expect(scope.storyMessages[0]).toBe("not enough wood.");
    });

    it("should message 'no more room for huts.' if there exists max number of huts", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {hut:20};
      scope.stores = {wood:10000};
      scope.createHut();
      expect(scope.storyMessages[0]).toBe("no more room for huts.");
    });

    it("should add a hut creation message if one is created", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {};
      scope.stores = {wood:100};
      scope.createHut();
      expect(scope.storyMessages[0]).toBe("builder puts up a hut, out in the forest. says word will get around.");
    });

    it("should add a hut to buildings when one is created", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {hut:0};
      scope.stores = {wood:100};
      scope.createHut();
      expect(scope.buildings.hut).toBe(1);
    });

    it("should remove 100 wood from stores when first hut is created", function () {
      createController();
      scope.room.fireNow = 3;
      scope.buildings = {};
      scope.stores = {wood:100};
      scope.createHut();
      expect(scope.stores.wood).toBe(0);
    });
  });

  describe("the method getHutCost", function () {
    it("should return 100 when there are no huts", function () {
      createController();
      scope.buildings = {};
      expect(scope.getHutCost()).toBe(100);
    });

    it("should return 150 when there is 1 hut", function () {
      createController();
      scope.buildings = {hut:1};
      expect(scope.getHutCost()).toBe(150);
    });
  });
  
  describe("the method increasePopIfNeeded", function () {
	it("should not increase population when argument is not 'hut'", function() {
		createController();
		scope.outside.currentPopulation = 0;
		scope.getRandomUpTo = function(limit) {return 0.1};
		scope.increasePopIfNeeded('test');
		
		expect(scope.outside.currentPopulation).toBe(0);
	});
  
	it("should not increase population when random number is less than 0.4", function() {
		createController();
		scope.outside.currentPopulation = 0;
		scope.getRandomUpTo = function(limit) {return 0.1};
		scope.increasePopIfNeeded('hut');
		
		expect(scope.outside.currentPopulation).toBe(0);
	});
	
	it("should increase population when random number is more than 0.4", function() {
		createController();
		scope.outside.maximumPopulation = 10
		scope.outside.currentPopulation = 0;
		scope.getRandomUpTo = function(limit) {return 9};
		scope.increasePopIfNeeded('hut');
		
		expect(scope.outside.currentPopulation).toBeGreaterThan(0);
	});
  });
  
  describe("the method increasePopulation", function () {
	  it("should increase currentPopulation", function(){
		  createController();
		  scope.outside.maximumPopulation = 8;
		  scope.outside.currentPopulation = 0;
		  scope.getRandomUpTo = function(limit) {return 2};
		  
		  scope.increasePopulation();
		  expect(scope.outside.currentPopulation).toBe(2);
	  });
	  
	  it("should add at least one person", function() {
		  createController();
		  scope.outside.maximumPopulation = 8;
		  scope.outside.currentPopulation = 0;
		  scope.getRandomUpTo = function(limit) {return 0};
		  scope.increasePopulation();
		  expect(scope.outside.currentPopulation).toBe(1);
	  });
	  
	  it("should message 'a stranger arrives in the night' if less than 2 people arrived", function(){
		  createController();
		  scope.outside.maximumPopulation = 8;
		  scope.outside.currentPopulation = 0;
		  scope.storyMessages = [];
		  scope.getRandomUpTo = function(limit) {return 1};
		  scope.increasePopulation();
		  expect(scope.storyMessages[0]).toBe('a stranger arrives in the night');
	  });
	  
	  it("should message 'a weathered family takes up in one of the huts.' if less than 5 people arrived", function(){
		  createController();
		  scope.outside.maximumPopulation = 8;
		  scope.outside.currentPopulation = 0;
		  scope.storyMessages = [];
		  scope.getRandomUpTo = function(limit) {return 4};
		  scope.increasePopulation();
		  expect(scope.storyMessages[0]).toBe('a weathered family takes up in one of the huts.');
	  });
	  
	  it("should message 'a small group arrives, all dust and bones.' if less than 10 people arrived", function(){
		  createController();
		  scope.outside.maximumPopulation = 40;
		  scope.currentPopulation = 0;
		  scope.storyMessages = [];
		  scope.getRandomUpTo = function(limit) {return 9};
		  scope.increasePopulation();
		  expect(scope.storyMessages[0]).toBe('a small group arrives, all dust and bones.');
	  });
	  
	  it("should message 'a convoy lurches in, equal parts worry and hope.' if less than 30 people arrived", function(){
		  createController();
		  scope.outside.maximumPopulation = 40;
		  scope.outside.currentPopulation = 0;
		  scope.storyMessages = [];
		  scope.getRandomUpTo = function(limit) {return 29};
		  scope.increasePopulation();
		  expect(scope.storyMessages[0]).toBe('a convoy lurches in, equal parts worry and hope.');
	  });
	  
	  it("should message 'the town's booming. word does get around.' if more than 30 people arrived", function(){
		  createController();
		  scope.outside.maximumPopulation = 40;
		  scope.outside.currentPopulation = 0;
		  scope.storyMessages = [];
		  scope.getRandomUpTo = function(limit) {return 39};
		  scope.increasePopulation();
		  expect(scope.storyMessages[0]).toBe("the town's booming. word does get around.");
	  });
  });
  
  describe("the method gatherWood", function () {
	it("should add a story message", function () {
      createController();
      scope.buildings = {};
      scope.stores = {wood:0};
      scope.storyMessages = [];
      scope.gatherWood();
      expect(scope.storyMessages.length).toBe(1);
    });

    it("should add 10 wood if cart does not exist", function () {
      createController();
      scope.buildings = {};
      scope.stores = {wood:0};
      scope.gatherWood();
      expect(scope.stores.wood).toBe(10);
    });

    it("should add 50 wood if cart does exist", function () {
      createController();
      scope.buildings = {cart:1};
      scope.stores = {wood:0};
      scope.gatherWood();
      expect(scope.stores.wood).toBe(50);
    });

    it("should create wood property if it does not exist", function () {
      createController();
      scope.buildings = {};
      scope.stores = {};
      scope.gatherWood();
      expect(scope.stores.wood).toBe(10);
    });

    it("should set wood button text to 'wait'", function () {
      createController();
      scope.buildings = {};
      scope.stores = {};
      scope.gatherWood();
      expect(scope.outside.woodText).toBe("wait...");
    });

    it("should set wood cooling text to true", function () {
      createController();
      scope.buildings = {};
      scope.stores = {};
      scope.gatherWood();
      expect(scope.outside.isWoodCooling).toBe(true);
    });
  });
  
  describe("the method getGatherAmount", function() {
    it("should return 10 if no cart exists", function(){
		createController();
		scope.buildings = {};
		expect(scope.getGatherAmount()).toBe(10);
	});
	
	it("should return 50 if cart exists", function(){
		createController();
		scope.buildings = {cart:1};
		expect(scope.getGatherAmount()).toBe(50);
	});
  });
    
  describe("the method addTrapsMessage", function() {
	  it("should message 'nothing in traps' when traps had zero yield", function() {
		createController();
		scope.storyMessages = [];
		caught = [
			{name: 'fur', amount:0},
			{name: 'meat', amount:0},
			{name: 'scales', amount:0},
			{name: 'teeth', amount:0}];
		scope.addTrapsMessage(caught);
		expect(scope.storyMessages[0]).toBe('nothing in traps');		  
	  });
	  
	  it("should list trap yields when it is bigger than zero", function() {
		createController();
		scope.storyMessages = [];
		caught = [
			{name: 'fur', message: 'scraps of fur', amount:1},
			{name: 'meat', message: 'bits of meat', amount:4},
			{name: 'scales', message: 'strange scales', amount:2},
			{name: 'teeth', message: 'scattered teeth', amount:2}];
		scope.addTrapsMessage(caught);
		expect(scope.storyMessages[0]).toBe('the traps contain scraps of fur, bits of meat, strange scales, scattered teeth');	
	  });
  });
  
  describe("the method addCaughtToStores", function() {
	  it("should add everything in caught to right resource in stores if resource already exists", function(){
		  createController();
		  scope.stores = {fur:1, meat:1, scales:1, teeth:1};
		  caught= [
			  {name: 'fur', amount:1},
			  {name: 'meat', amount:2},
			  {name: 'scales', amount:3},
			  {name: 'teeth', amount:4}];
		  scope.addCaughtToStores(caught);
		  expect(scope.stores.fur).toBe(2);
		  expect(scope.stores.meat).toBe(3);
		  expect(scope.stores.scales).toBe(4);
		  expect(scope.stores.teeth).toBe(5);
	  });
	  
	  it("should add everything in caught to stores if resource does not exist", function(){
		  createController();
		  scope.stores = {};
		  caught= [
			  {name: 'fur', amount:1},
			  {name: 'meat', amount:2},
			  {name: 'scales', amount:3},
			  {name: 'teeth', amount:4}];		  
		  scope.addCaughtToStores(caught);		  
		  expect(scope.stores.fur).toBe(1);
		  expect(scope.stores.meat).toBe(2);
		  expect(scope.stores.scales).toBe(3);
		  expect(scope.stores.teeth).toBe(4);
	  });
  });
  
  describe("the method arriveToForest", function () {
    it("should add a story message if forest has not been visited", function () {
      createController();
      scope.outside.isForestVisited = false;
      scope.storyMessages = [];
      scope.arriveToForest();
      expect(scope.storyMessages.length).toBe(1);
    });
    
    it("should set forest as visited", function () {
      createController();
      scope.outside.isForestVisited = false;
      scope.arriveToForest();
      expect(scope.outside.isForestVisited).toBe(true);
    });

    it("should do nothing is forest has been visited before", function () {
      createController();
      scope.outside.isForestVisited = true;
      scope.storyMessages = [];
      scope.arriveToForest();
      expect(scope.storyMessages.length).toBe(0);
      expect(scope.outside.isForestFound).toBe(false);
    });
  });

  describe("the method unLockForest", function () {
	it("should set isForestFound to true", function () {
      createController();
      scope.outside.isForestFound = false;
      scope.unlockForest();
      expect(scope.outside.isForestFound).toBe(true);
    });

    it("should add two messages to story messages", function () {
      createController();
      scope.storyMessages = [];
      scope.unlockForest();
      expect(scope.storyMessages.length).toBe(2);
    });
  });

  describe("the method getMaximumPopulation", function () {
    it("should return 0 as maximum population when there are no huts", function() {
      createController();
      scope.buildings = {};
      expect(scope.getMaximumPopulation()).toBe(0);
    });

    it("should return 4 as maximum population when there is 1 hut", function () {
      createController();
      scope.buildings = {hut:1};
      expect(scope.getMaximumPopulation()).toBe(4);
    });
  });
  
  describe("the method addStoryMessage", function() {
    it("should add new story message to the beginning of the array", function() {
      createController();
      scope.storyMessages = ["first."];
      scope.addStoryMessage("test");
      expect(scope.storyMessages[0]).toBe("test");
    });
  });
});