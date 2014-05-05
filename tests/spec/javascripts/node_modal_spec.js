
require('/node_modal.js');

describe('Node Modal widget', function() {

	it('can be appended to the DOM element', function() {

		$('<button id="add-human-modal" class="add-node-modal btn btn-info">New Shareholder</button>').nodeFormModal();
	    });

	it('cannot be appended twice to the same DOM element', function() {

		$e = $('<button id="add-human-modal" class="add-node-modal btn btn-info">New Shareholder</button>');
		$e.nodeFormModal();

		expect($e.nodeFormModal()).toEqual($e.nodeFormModal());
	    });

	it('it can bind data to the DOM element', function() {

		$e = $('<button id="add-human-modal" class="add-node-modal btn btn-info">New Shareholder</button>');
		$e.nodeFormModal();
		$e.set('testProperty', 9);
		
		expect($e.get('testProperty')).toEqual(9);
		expect($e.get('testProperty')).not.toEqual(10);
		expect($e.get('testProperty2')).not.toBeDefined();
	    });

	it('can retrieve the method name from the Element ID attribute', function() {

		$e = $('<button id="add-human-modal" class="add-node-modal btn btn-info">New Shareholder</button>');
		$e.nodeFormModal();
		
		expect($e.getMethodForElement()).toEqual('add');

		$e = $('<button id="edit-123-modal" class="add-node-modal btn btn-info">New Shareholder</button>');
		$e.nodeFormModal();
		expect($e.getMethodForElement()).toEqual('edit');
	    });

	it('can retrieve the content type name from the Element ID attribute', function() {

		$e = $('<button id="add-human-modal" class="add-node-modal btn btn-info">New Shareholder</button>');
		$e.nodeFormModal();
		
		expect($e.getContentTypeForElement()).toEqual('human');

		$e = $('<button id="add-book-modal" class="add-node-modal btn btn-info">New Book</button>');
		$e.nodeFormModal();
		expect($e.getContentTypeForElement()).toEqual('book');
	    });

	it('can retrieve the content type name from the Element ID attribute', function() {

		$e = $('<button id="add-human-modal" class="add-node-modal btn btn-info">New Shareholder</button>');
		$e.nodeFormModal();
		
		expect($e.getContentTypeForElement()).toEqual('human');

		$e = $('<button id="add-book-modal" class="add-node-modal btn btn-info">New Book</button>');
		$e.nodeFormModal();
		expect($e.getContentTypeForElement()).toEqual('book');
	    });

	it('can retrieve the type of human node from the Element text content', function() {

		$e = $('<button id="add-human-modal" class="add-node-modal btn btn-info">New Shareholder</button>');
		$e.nodeFormModal();

		expect($e.get('humanType')).toEqual('Shareholder');

		// Resolve
		//$e = $('<button id="edit-1234-modal" class="add-node-modal btn btn-info">New Representative</button>');
		$e = $('<button id="add-human-modal" class="add-node-modal btn btn-info">New Representative</button>');
		$e.nodeFormModal();

		expect($e.get('humanType')).toEqual('Representative');
	    });

	it('can retrieve the type of human node from the Element text content', function() {

		$e = $('<button id="add-human-modal" class="add-node-modal btn btn-info">New Shareholder</button>');
		$e.nodeFormModal();

		expect($e.get('humanType')).toEqual('Shareholder');

		// Resolve
		$e = $('<button id="edit-human-1234-modal" class="edit-node-modal btn btn-info">New Representative</button>');
		//$e = $('<button id="add-human-modal" class="add-node-modal btn btn-info">New Representative</button>');
		$e.nodeFormModal();

		expect($e.get('humanType')).toEqual('Representative');
	    });

	// Functional tests
    });