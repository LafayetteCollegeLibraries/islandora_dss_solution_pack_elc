
/**
 * @file The test specs for the NodeFormModal Class
 * @author griffinj@lafayette.edu
 *
 */

/**
 * Mapping single suite to New Feature/User Story
 *
 * Extend for bugs, possibly for improvements
 *
 */

describe("NodeFormModal", function() {

	beforeEach(function() {

		// @todo Refactor using fixtures
		e = $('<button class="add-node-modal btn btn-info" id="add-human-modal" type="button" data-content-type="human" data-node-type="" data-input="#edit-field-bib-rel-subject-und">Create New Person</button>').appendTo('body');

		// @todo Refactor with the jQuery plug-in
		var key = $(e).attr('data-content-type') + '-' + $(e).attr('data-node-type');

		modal = new NodeFormModal({
			button: $(e),
			contentType: $(e).attr('data-content-type'),
			nodeType: $(e).attr('data-node-type'),
			input: $(e).attr('data-input'),
			key: key
		    });
	    });

	it("gets attributes", function() {

		expect(modal.get('contentTypeName')).toBe('human');
	    });

	it("sets attributes", function() {

		modal.set('nodeType', 'Author');
		expect(modal.get('nodeType')).toBe('Author');
	    });

	
    });
