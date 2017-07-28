'use strict';

describe('my app', function() {

	it('should initialize builder correctly', function() {
		browser.get('index.html');
		element(by.buttonText('light fire')).click();
		element(by.buttonText('stoke fire')).click();
		browser.manage().timeouts().pageLoadTimeout(61000);
		
		var messages = element.all(by.repeater('message in storyMessages'));
		
		expect(messages.get(7).getText()).toEqual('a ragged stranger stumbles through the door and collapses in the corner.');
		expect(messages.get(6).getText()).toEqual('the stranger shivers, and mumbles quietly. her words are unintelligible.');
		expect(messages.get(5).getText()).toEqual('the wind howls outside.');
		expect(messages.get(4).getText()).toEqual('the wood is running out.');
		expect(messages.get(3).getText()).toEqual('the stranger in the corner stops shivering. her breathing calms.');
		expect(messages.get(2).getText()).toEqual('the stranger is standing by the fire. she says she can help. says she builds things.');
		expect(messages.get(1).getText()).toEqual('something is scraping near the door.');
	});
});
