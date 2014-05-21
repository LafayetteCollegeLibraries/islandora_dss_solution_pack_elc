
/**
 * The NodeModal Drupal 7 jQuery Plug-in
 * @author griffinj@lafayette.edu
 */

/**
 * Inline instantiation for the invocation of instance and static methods from within the constructor
 * @todo Refactor by extending Backbone.js Model
 *
 */
function NodeFormModal() {};

/**
 * Integrate with jQuery
 *
 */
NodeFormModal.jQuery = jQuery;

/**
 * Static constants
 *
 */
NodeFormModal.MODAL_RIGHT_POSITION = {

    my: 'right bottom',
    at: 'right bottom',
    of: window
};

NodeFormModal.MODAL_LEFT_POSITION = {

    my: 'left top',
    at: 'left top',
    of: window
};

NodeFormModal.CONTAINER_STYLE = false;
NodeFormModal.CONTAINER_INDEX = 0;

NodeFormModal.STYLE_ELEMENTS = '';

/**
 * Static methods
 *
 */

/**
 * Methods
 *
 */

/**
 * Mutate the Object appended to the jQuery Object using .data()
 * @todo Refactor by extending the Backbone.js Model
 *
 */
NodeFormModal.prototype.set = function(property, value) {
    
    /*
    nodeFormModal = this.$element.data('nodeFormModal');
    nodeFormModal[property] = value;
    
    return this.$element.data('nodeFormModal',  nodeFormModal);
    */

    this[property] = value;
    return this.$element.data('nodeFormModal',  this);
};

/**
 * Access the Object appended to the jQuery Object using .data()
 * @todo Refactor by extending the Backbone.js Model
 *
 */
NodeFormModal.prototype.get = function(property) {
	    
    return this.$element.data('nodeFormModal')[property];
};

/**
 * Retrieve the name of the operation at the data access layer (i. e. add, edit, delete...) from the element ID
 *
 */
NodeFormModal.prototype.getMethodForElement = function() {
	    
    // Throw an exception if the ID is badly formed
    // The value of method must lie within the scope of each individual element handler
    try {
		
	return /(.+?)\-/.exec(this.$element.attr('id'))[1];
    } catch(e) {
	
	throw new Error('Badly formed element ID does not contain the name of the method: ' + this.$element.attr('id'));
    }
};

/**
 * Retrieve the name of the Content Type from the @data-content-type value for the element
 *
 */
NodeFormModal.prototype.getContentTypeForElement = function() {

    return this.button.attr('data-content-type');

    /*
    switch(this.method) {
		
    case 'edit':
	    
    pattern = RegExp('edit\-(.+?)\-([0-9]+?)\-modal');
    break;
	    
    case 'add':
	    
    pattern = RegExp('add\-(.+?)\-modal');
    matchIndex = 1;
    break;
	    
    default:
	    
    throw new Error('Badly formed element ID does not contain the method name "' + this.method + '": ' + this.$element.attr('id'));
    }
	    
    m = pattern.exec( this.$element.attr('id'));
    if(m) {
		
	return m[1];
    } else {
	
	return 'node';
    }
    */
};

NodeFormModal.prototype.openDialog = function() {

    /**
     * Integration with jQuery
     * @todo Refactor
     *
     */
    var $ = NodeFormModal.jQuery;

    /**
     * Set the dialog options
     * @todo Refactor for the individual options passed to the jQuery UI widget
     *
     */
    dialogOptions = {
		    
	autoOpen: false,
	title: this.dialogTitle,
	width: 600,
	height: (['book', 'periodical', 'item'].indexOf(this.contentTypeName) != -1 ? 560 : 448),
	close: function( event, ui ) {
	
	    /*
	    $('#modal-content-container').data('nodeFormModal', {
		    contentTypeName: $('#modal-content-container').data('nodeFormModal'),
		    humanType: $('#modal-content-container').data('nodeFormModal')
		    });
	    */
	}
    };

    //$(this).data('nodeFormModal')['modalPosition'] = !$(this).data('nodeFormModal')['modalPosition'];
    // Alternate the position of the dialog

    this.$container.dialog(dialogOptions);		
    this.$container.dialog('open');

    /**
     * @todo Resolve for the navbar
     *
     */
    this.$container.parent().css('z-index', 20000 + 10000 * $('.ui-dialog').length);

    // Legacy
    this.$modal = this.$container;
};

NodeFormModal.prototype.closeDialog = function() {

    // Close the container
    this.$container.dialog('close');
    this.$container.remove();
};

NodeFormModal.onFormAjaxSuccessHandler = function(data, textStatus, xhr) {

    /**
     * Integration with jQuery
     * @todo Refactor
     *
     */
    var $ = NodeFormModal.jQuery;

    $modalContainer = $('.modal-content-container').last();
    /*
      $modal = $modalContainer.data('nodeFormModal')['modal'];
      contentTypeName = $modalContainer.data('nodeFormModal')['contentTypeName'];
      $relatedFormElement = $modalContainer.data('nodeFormModal')['relatedFormElement'];
      
      $submit = $( '.ui-dialog').last().find('#edit-publish.btn');
    */
	    
    //$submit = $modalContainer.data('nodeFormModal')['relatedFormElement'];

    /**
     * Error handling
     * HTTP headers are consistently 200 when form submissions are not valid
     * As a result, one must parse the HTML in the response from the server
     * @todo Extend
     *
     */
    var error = $(data).find('div.error');
    if(error.length > 0) {
	
	// For each error, instantiate a jQuery UI Dialog widget
	$.map(error, function(e, i) {
	
		$(e).dialog();
	    });
    } else {

	/**
	 * In order to locate the parent form, iterate through all modals and retrieve the modal with the highest z-index
	 * @todo Dereference from a jQuery element wrapper
	 */
	//$thisModal = null;
	var $thisModal;
	$('.ui-dialog').map(function(i, e) {
			
		$e = $(e);

		if(!$thisModal || (parseInt($e.css('zIndex'), 10) > parseInt($thisModal.css('zIndex'), 10))) {
		    
		    $thisModal = $e;
		}
	    });

	$submit = $thisModal.find('#edit-publish');
	//$submit = $thisModal.find('#edit-submit');
		
	$relatedFormElement = $submit.data('nodeFormModal').relatedFormElement;
		
	// This updates the form element to which the button was related
	$relatedInputField = $relatedFormElement.parent().parent().find('input.form-text:last');
		
	// This assumes that the title is the first field
	//entityRefStr = $(data).find('div.field-item.even').first().text() + ' (' + nodeId + ')';
	entityRefStr = $(data).find('em.placeholder').text();
		
	/**
	 * Work-around
	 * Find the ID of the newly-saved Node by parsing the HTML
	 * @todo Refactor with Backbone.js and RESTful service endpoints
	 */
	nodeId = /node\-(\d+)/.exec($(data).find('article').attr('id'))[1];
	entityRefStr += ' (' + nodeId + ')';
		
		/*
		  / **
		  * Work-around
		  * One must query Drupal again for the entity ID
		  *
		  * /
		  
		  var m = /edit\-(.+?)\-und/.exec($relatedInputField.attr('id'));
		  var inputFieldName = m[1];
		  inputFieldName = inputFieldName.replace(/\-/g, '_', 'g');
		  $.get('/entityreference/autocomplete/tags/' + inputFieldName + '/node/item/NULL/' + encodeURI(entityRefStr), function(data) {
		  
		  var entities = Object.keys(data).sort(function(u, v) {
		  
		  u = /\((\d+)\)/.exec(u)[1];
		  v = /\((\d+)\)/.exec(v)[1];
		  
		  if(u < v) {
		  
		  return -1;
		  }
		  if(u > v) {
		  
		  return 1;
		  }
							    
		  return 0;
		  });
		  var m = /(".+?")/.exec(entities.pop());
		  
		  if(m) {
		  
		  //islandoraDssElc['autoCompleteItem'] = m[1];
		  //entityRefStr += ' (' + entityRefId + ')';
		  
		  entityRefStr = m[1];
		  }
		  });
		*/
		
		//$relatedInputField.val(entityRefStr);
		
		/**
		 * Handling for personal relationship nodes
		 *
		 */
		if($relatedInputField.attr('id') == 'edit-field-pers-rel-object-und') {
		    
		    $relatedInputField.val(entityRefStr);
		    //$relatedInputField.change();
		} else {
		    
		    /**
		     * Integration for tokenization
		     * @todo Refactor
		     */
		    $("<li><a href='#' class='token'><span>" + '"' + entityRefStr + '"' + "</span><span class='token-x'>×</span></a></li>").appendTo( $relatedInputField.siblings('.token-list') );
		    $relatedInputField.val('');
		}

	// Trigger any handlers bound to the form field using the jQuery "change" event
	$relatedInputField.change();
    }
};

/**
 * Static method for retrieving the key
 * @todo Override @data-* selectors
 *
 */
NodeFormModal.key = function(e) {

    return $(e).attr('data-content-type') + '-' + $(e).attr('data-node-type');
};

/**
 * Static method for handling form submissions
 *
 */
NodeFormModal.onSubmitHandler = function(event) {

    /**
     * Integration with jQuery
     * @todo Refactor
     *
     */
    var $ = NodeFormModal.jQuery;

    event.preventDefault();
    event.stopImmediatePropagation();

    /**
     * @todo Restructure this for namespace handling
     * dss.nodeFormModal
     *
     */
    //var nodeFormModal = $(this).data('dssNodeFormModal');
    var nodeFormModal = $(this).data('nodeFormModal');
    //$form = $(this).data('nodeFormModal').form;
    $form = nodeFormModal.form;

    //$.post('/node/' + method + '/' + contentTypeName, form.serialize(), function(data, textStatus) {
    $.post($form.attr('action'), $form.serialize(), NodeFormModal.onFormAjaxSuccessHandler);
};

/**
 * Static method for handling AJAX responses
 *
 */
NodeFormModal.onAjaxSuccessHandler = function(data, textStatus, xhr) {

    /**
     * Integration with jQuery
     * @todo Refactor
     *
     */
    var $ = NodeFormModal.jQuery;

    /**
     * Retrieve the modal container from the Document
     * Note: This requires that the container be the last of its class appended to the Document
     * @todo Refactor
     *
     */

    /*
    // Retrieve the NodeFormModal Objects from the global scope
    var dssNodeFormModals = $(document).data('dssNodeFormModals');

    // Retrieve the NodeFormModal Objects using a unique key passed in the AJAX request
    var key = xhr;
    var dssNodeFormModal = dssNodeFormModals[key];
    */

    /**
     * Work-around
     * Cannot pass the reference to the global context for handling AJAX response
     * @todo Refactor
     */
    var dssNodeFormModal = $(document).data('currentNodeFormModal');

    var $modalContainer = dssNodeFormModal.$container;

    // Populate the current modal container with the main Drupal content within the HTTP response
    $modalContainer.append($(data).find('.main-container'));

    //$modal = $modalContainer.data('nodeFormModal')['modal'];
    var $modal = dssNodeFormModal.$modal;

    //contentTypeName = $modalContainer.data('nodeFormModal')['contentTypeName'];
    //$relatedFormElement = $modalContainer.data('nodeFormModal')['relatedFormElement'];
    var contentTypeName = dssNodeFormModal.contentTypeName;
    var $relatedFormElement = $(dssNodeFormModal.button);

    // Retrieve the requested form by using the identifier specific to the bundle
    $form = $modalContainer.find('form#' + contentTypeName + '-node-form');

    // Empty the modal container, the modal itself, and insert the content into the dialog
    $modalContainer.empty();
    $modal.empty();
    $modal.append($form);

    /**
     * Recursively applies the click handler for all buttons within AJAX-loaded content
     * @todo Refactor?
     *
     */
    //$form.find('.add-node-modal').click($relatedFormElement.click);
    $form.find('.add-node-modal').each(function(i, e) {

	    $(e).nodeFormModal(true);
	});

    // Retrieve the type of Human being added, and prepopulate the form
    if(dssNodeFormModal.humanType) {

	$modal.find('#edit-field-person-type-und').val(dssNodeFormModal.humanType);
    }

    // Hide the preview and submit buttons
    $modal.find('#edit-preview').hide();
    $modal.find('#edit-submit').hide();

    // Set the submit form button to the publish button
    dssNodeFormModal.$submit = $modal.find('#edit-publish');
    $submit = dssNodeFormModal.$submit;

    /**
     * Forcibly append the hidden form element for the Publish action and the append certain JavaScript <script> elements
     * @todo Refactor
     *
     */
    $('<input type="hidden" value="Publish" name="op" />').appendTo($form);
    // Work-around
    $form.append(NodeFormModal.STYLE_ELEMENTS);
    
    // Ensure that the object can be dereferenced from the form Submit button itself
    $submit.data('nodeFormModal', {
	    
	    relatedFormElement: $relatedFormElement,
		form: $form,
		//container: $(this)
		container: $modal
		});

    // Submit handler
    $submit.click(NodeFormModal.onSubmitHandler);
};

/**
 * Static method for handling the click on the "Create" or "Edit" Node Button
 *
 */
NodeFormModal.onClickHandler = function(event) {

    /**
     * Integration with jQuery
     * @todo Refactor
     *
     */
    var $ = NodeFormModal.jQuery;

    // property values are relative to the scope, and only the state of the HTML Document persists between method calls
    event.preventDefault();
    event.stopImmediatePropagation();

    //var nodeFormModal = $(this).data('dssNodeFormModal');
    var nodeFormModal = $(this).data('nodeFormModal');

    /**
     * Work-around
     * Cannot pass the reference to the global context for handling AJAX response
     * @todo Refactor
     */
    $(document).data('currentNodeFormModal', nodeFormModal);
    
    nodeFormModal.openDialog();

    contentTypeName = nodeFormModal.contentTypeName;
    var url = '/node/add/' + contentTypeName;		
    $modalContainer = $('<div id="modal-content-container-' + contentTypeName + '" class="modal-content-container" style="display: none;"></div>').appendTo($('body'));

    $modalContainer.data('nodeFormModal', {
	    
	    relatedFormElement: $(this),
		contentTypeName: nodeFormModal.contentTypeName,
		humanType: nodeFormModal.humanType,
		modal: nodeFormModal.container
		});

    // Submit the AJAX request
    $.get(url, { isModalQuery: true }, NodeFormModal.onAjaxSuccessHandler);
};

/**
 * Constructor for the NodeForModal class
 * @constructor
 * @todo Refactor by extending the Backbone.js Model
 *
 */
//NodeFormModal.prototype.constructor = function NodeFormModal(options) {
function NodeFormModal(options) {

    // Require jQuery integration
    this.$ = options.jQuery || jQuery;
    var $ = this.$;
    
    settings = $.extend({}, options);

    // The unique key for the Object
    this.key = settings.key;

    this.button = settings.button;
    // Reference the Object from within the DOM
    //$(this.button).data('dssNodeFormModal', this);
    $(this.button).data('nodeFormModal', this);

    // Legacy
    this.$element = $(settings.button);

    // Retrieve the method name for the Form
    this.method = this.getMethodForElement();
    this.set('method', this.method);

    // Retrieve the Content Type (i. e. bundle) for the Form
    this.contentTypeName = settings.contentType || this.getContentTypeForElement();
    this.set('contentTypeName', this.contentTypeName);

    // Set the @id and @class attributes for the HTML container
    this.id = this.method + '-' + this.contentTypeName + '-modal';
    this.classes = [this.method + '-node-modal-container'];

    // Assume that we are always dealing with valid HTML
    this.$container = $('<div id="' + this.id + '" class="' + this.classes.join(' ') + '">Loading...</div>').appendTo($('body')).hide();

    // Legacy
    this.nodeType = settings.nodeType;
    this.humanType = this.nodeType;

    /**
     * Set the title
     * @todo Refactor for the title of the dialog
     *
     */
    if(this.humanType) {

	this.dialogTitle = 'Add ' + this.humanType[0].toUpperCase() + this.humanType.slice(1);
    } else {

	this.dialogTitle = 'Add ' + this.contentTypeName[0].toUpperCase() + this.contentTypeName.slice(1);
    }

    // Set the handler for the jQuery "click" event
    $(this.button).click(NodeFormModal.onClickHandler);
};
    
(function($) {

    /**
     * The NodeFormModal Object
     * Instantiate jQuery UI modal Dialog widgets for Drupal Node Objects
     *
     */
    $.fn.nodeFormModal = function(isAjaxRequest) {

	return this.each(function(i,e) {

		// Retrieve the NodeFormModal Objects from the global scope
		var dssNodeFormModals = $(document).data('dssNodeFormModals') || {};

		// Store a new NodeFormModal instance into the DOM for reference within the global context
		/**
		 * Generate the unique key for the Object
		 * @todo Refactor with @id or @data-* values
		 *
		 */
		var key = $(e).attr('data-content-type') + '-' + $(e).attr('data-node-type');
		dssNodeFormModals[key] = new NodeFormModal({
			button: $(e),
			contentType: $(e).attr('data-content-type'),
			nodeType: $(e).attr('data-node-type'),
			key: key
		    });
		$(document).data('dssNodeFormModals', dssNodeFormModals);
	    });
    };
}(jQuery));
